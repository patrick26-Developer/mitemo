import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { useToastStore } from "../../../shared/feedback/store.toast";
import { makeCard, TEST_PORTFOLIO } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsOptionsSheet } from "./sheet.savings-options";

jest.mock("expo-router", () => ({ router: { back: jest.fn(), push: jest.fn() } }));

/** Carte neuve, sans pointage. */
const FRESH = makeCard({ id: "c1", name: "Loyer", saved: 0n, entries: [], markerAmount: 5_000n });

describe("SavingsOptionsSheet", () => {
  beforeEach(() => {
    usePortfolioStore.setState({ ...TEST_PORTFOLIO, cards: [FRESH] });
    useToastStore.getState().dismiss();
  });

  it("ouvre sur Temo et le niveau de la carte, puis les modifications et la suppression", async () => {
    await renderWithSafeArea(<SavingsOptionsSheet visible item={FRESH} onClose={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Options de la carte" })).toBeOnTheScreen();
    expect(screen.getByText("Niveau 2 sur 5 · carte bleue")).toBeOnTheScreen();
    expect(screen.getByLabelText("Objectif (FCFA)")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Supprimer la carte" })).toBeOnTheScreen();
  });

  it("enregistre un nouveau pointage, qui change le niveau de la carte", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SavingsOptionsSheet visible item={FRESH} onClose={onClose} />);

    await fireEvent.changeText(screen.getByLabelText("Montant par pointage (FCFA)"), "20000");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(usePortfolioStore.getState().cards[0]?.markerAmount).toBe(20_000n);
    expect(usePortfolioStore.getState().cards[0]?.tint).toBe("#F2C9E4");
    expect(onClose).toHaveBeenCalled();
  });

  it("refuse une saisie invalide en toast, sans fermer", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SavingsOptionsSheet visible item={FRESH} onClose={onClose} />);

    await fireEvent.changeText(screen.getByLabelText("Montant par pointage (FCFA)"), "900000");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(useToastStore.getState().toast?.message).toBe(
      "Le pointage ne peut pas dépasser l'objectif.",
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it("supprime une carte sans pointage après confirmation, et revient en arrière", async () => {
    await renderWithSafeArea(<SavingsOptionsSheet visible item={FRESH} onClose={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Supprimer la carte" }));
    await fireEvent.press(screen.getByRole("button", { name: "Supprimer" }));

    expect(router.back).toHaveBeenCalled();
    expect(usePortfolioStore.getState().cards).toEqual([]);
  });

  it("fige les montants et retire la suppression d'une carte déjà pointée", async () => {
    const pointed = { ...FRESH, saved: 5_000n };
    await renderWithSafeArea(<SavingsOptionsSheet visible item={pointed} onClose={jest.fn()} />);

    expect(screen.queryByLabelText("Objectif (FCFA)")).toBeNull();
    expect(screen.queryByRole("button", { name: "Supprimer la carte" })).toBeNull();
  });
});
