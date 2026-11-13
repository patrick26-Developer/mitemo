import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { useCelebrationStore } from "../../../shared/feedback/store.celebration";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineCreateSheet } from "./sheet.tontine-create";

/**
 * Remplit la première étape et passe à la suivante.
 * @param name Nom de la tontine.
 */
async function fillEssentials(name = "Tontine du Marché"): Promise<void> {
  await fireEvent.changeText(screen.getByLabelText("Nom"), name);
  await fireEvent.changeText(screen.getByLabelText("Cotisation par tour (FCFA)"), "5000");
  await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));
}

/**
 * Choisit une fréquence dans la liste ouverte.
 * @param label Libellé de la fréquence à sélectionner.
 */
async function chooseCadence(label: string): Promise<void> {
  await fireEvent.press(screen.getByTestId("sheet-select-trigger"));
  await fireEvent.press(screen.getByRole("button", { name: label }));
}

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("TontineCreateSheet", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("commence à l'étape 1 sur 3, sans bouton Annuler", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);

    expect(
      screen.getByRole("progressbar", { name: "Étape 1 sur 3 : L'essentiel" }),
    ).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
  });

  it("reste à la première étape tant que le nom manque", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(screen.getByText("Donnez un nom à la tontine.")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar", { name: /Étape 1 sur 3/ })).toBeOnTheScreen();
  });

  it("refuse un nom sans lettre et compte les caractères saisis", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);

    await fillEssentials("2026");

    expect(screen.getByText("Le nom doit contenir au moins une lettre.")).toBeOnTheScreen();
    expect(screen.getByText("Le nom que verront les membres. 4/30")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar", { name: /Étape 1 sur 3/ })).toBeOnTheScreen();
  });

  it("fait choisir la fréquence dans une liste groupée, sans saisir d'intervalle", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);
    await fillEssentials();

    expect(
      screen.getByRole("progressbar", { name: "Étape 2 sur 3 : Le rythme" }),
    ).toBeOnTheScreen();
    expect(screen.queryByLabelText("Intervalle")).toBeNull();
    expect(screen.getByLabelText("Fréquence des tours : Chaque semaine")).toBeOnTheScreen();

    await chooseCadence("Toutes les 2 semaines");

    expect(screen.getByLabelText("Fréquence des tours : Toutes les 2 semaines")).toBeOnTheScreen();
  });

  it("fait saisir les participants au clavier, sur l'étape de la fréquence", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);
    await fillEssentials();

    expect(
      screen.getByRole("progressbar", { name: "Étape 2 sur 3 : Le rythme" }),
    ).toBeOnTheScreen();
    expect(screen.queryByLabelText("Tours")).toBeNull();

    expect(screen.queryByLabelText("Augmenter Participants")).toBeNull();
    expect(screen.getByLabelText("Participants")).toHaveDisplayValue("6");

    await fireEvent.changeText(screen.getByLabelText("Participants"), "8");

    expect(screen.getByLabelText("Participants")).toHaveDisplayValue("8");
  });

  it("revient à l'étape précédente en gardant la saisie", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);
    await fillEssentials();

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(screen.getByDisplayValue("Tontine du Marché")).toBeOnTheScreen();
  });

  it("résume tout, crée la tontine, puis ouvre directement sa page, sans étape d'invitation", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<TontineCreateSheet visible onClose={onClose} />);
    await fillEssentials();
    await chooseCadence("Toutes les 2 semaines");
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(
      screen.getByRole("progressbar", { name: "Étape 3 sur 3 : Le récapitulatif" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("Tontine du Marché")).toBeOnTheScreen();
    expect(screen.getByText("toutes les 2 semaines")).toBeOnTheScreen();
    expect(screen.getByText("6 membres")).toBeOnTheScreen();
    expect(screen.getByText("25 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();
    expect(screen.getAllByTestId(/^fact-row-/)).toHaveLength(5);
    expect(screen.getAllByTestId("fact-divider")).toHaveLength(4);

    await fireEvent.press(screen.getByRole("button", { name: "Créer la tontine" }));

    const created = usePortfolioStore
      .getState()
      .tontines.find((item) => item.name === "Tontine du Marché");
    expect(created?.frequency).toEqual({ unit: "semaine", interval: 2 });
    expect(created?.totalRounds).toBe(6);
    expect(useCelebrationStore.getState().burst).not.toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith(`/tontine/${created?.id ?? "absent"}`);
    expect(screen.queryByText("Votre tontine est prête")).toBeNull();
  });
});
