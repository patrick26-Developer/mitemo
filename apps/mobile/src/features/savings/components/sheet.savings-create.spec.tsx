import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { tomorrowUtc } from "../../../shared/model/model.clock";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsCreateSheet } from "./sheet.savings-create";

/**
 * Remplit la première étape et passe au rythme.
 * @param name Nom de la carte.
 */
async function fillProject(name = "Loyer de Février"): Promise<void> {
  await fireEvent.changeText(screen.getByLabelText("Nom"), name);
  await fireEvent.changeText(screen.getByLabelText("Objectif (FCFA)"), "60000");
  await fireEvent.changeText(screen.getByLabelText("Montant par pointage (FCFA)"), "5000");
  await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));
}

/**
 * Choisit une échéance au calendrier, en touchant le premier jour proposé.
 */
async function chooseDeadline(): Promise<void> {
  await fireEvent.press(screen.getByTestId("sheet-date-trigger"));
  await fireEvent(
    screen.getByTestId("native-date-picker"),
    "change",
    { type: "set" },
    new Date(`${tomorrowUtc()}T00:00:00.000Z`),
  );
}

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("SavingsCreateSheet", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("commence à l'étape 1 sur 2, sans rythme ni bouton Annuler", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);

    expect(
      screen.getByRole("progressbar", { name: "Étape 1 sur 2 : Le projet" }),
    ).toBeOnTheScreen();
    expect(screen.queryByLabelText("Échéance : aucune date")).toBeNull();
    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
  });

  it("reste à la première étape tant que l'objectif manque", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(screen.getByText("Donnez un nom à la carte.")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar", { name: /Étape 1 sur 2/ })).toBeOnTheScreen();
  });

  it("choisit le rythme et l'échéance, puis résume les pointages sans répéter les champs", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);
    await fillProject();

    expect(
      screen.getByRole("progressbar", { name: "Étape 2 sur 2 : Le rythme" }),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText("Fréquence des pointages : Chaque semaine")).toBeOnTheScreen();

    await chooseDeadline();

    expect(screen.getByText("60 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("5 000 FCFA")).toBeOnTheScreen();
    expect(screen.queryByText("chaque semaine")).toBeNull();
    expect(screen.getByText("Frais Mitemo (10 %)")).toBeOnTheScreen();
    expect(screen.getByText("6 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByTestId("sheet-action-row")).toBeOnTheScreen();
  });

  it("revient à la première étape en gardant la saisie", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);
    await fillProject();

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(screen.getByDisplayValue("Loyer de Février")).toBeOnTheScreen();
  });

  it("crée la carte avec les pointages déduits du rythme, puis ouvre sa page", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={onClose} />);
    await fillProject();
    await chooseDeadline();

    await fireEvent.press(screen.getByRole("button", { name: "Créer la carte" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    const created = usePortfolioStore
      .getState()
      .cards.find((item) => item.name === "Loyer de Février");
    expect(created?.goal).toBe(60_000n);
    expect(created?.deadline).toBe(tomorrowUtc());
    expect(created?.markersTotal).toBeGreaterThan(0);
    expect(router.push).toHaveBeenCalledWith(`/savings-detail/${created?.id ?? "absent"}`);
  });

  it("refuse de créer une carte sans échéance", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={onClose} />);
    await fillProject("Assurance");

    await fireEvent.press(screen.getByRole("button", { name: "Créer la carte" }));

    expect(screen.getByText("Choisissez une date d'échéance.")).toBeOnTheScreen();
    expect(onClose).not.toHaveBeenCalled();
  });
});
