import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { tomorrowUtc } from "../../../shared/model/model.clock";
import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
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

  it("commence à l'étape 1 sur 3, sans rythme ni bouton Annuler", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);

    expect(
      screen.getByRole("progressbar", { name: "Étape 1 sur 3 : Le projet" }),
    ).toBeOnTheScreen();
    expect(screen.queryByLabelText("Échéance : aucune date")).toBeNull();
    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
  });

  it("reste à la première étape tant que l'objectif manque", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(screen.getByText("Donnez un nom à la carte.")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar", { name: /Étape 1 sur 3/ })).toBeOnTheScreen();
  });

  it("choisit le rythme, l'échéance et la tontine dans des listes, sans récapitulatif", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);
    await fillProject();

    expect(
      screen.getByRole("progressbar", { name: "Étape 2 sur 3 : Le rythme" }),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText("Fréquence des pointages : Chaque semaine")).toBeOnTheScreen();
    expect(screen.getByLabelText("Tontine rattachée : Aucune tontine")).toBeOnTheScreen();
    expect(screen.queryByText("Frais Mitemo (10 %)")).toBeNull();
  });

  it("résume la carte au dernier pas, juste avant de la créer", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);
    await fillProject();
    await chooseDeadline();
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(
      screen.getByRole("progressbar", { name: "Étape 3 sur 3 : Le récapitulatif" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("60 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("5 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("Frais Mitemo (10 %)")).toBeOnTheScreen();
    expect(screen.getByText("6 000 FCFA")).toBeOnTheScreen();
    expect(screen.getAllByTestId(/^fact-row-/)).toHaveLength(4);
    expect(screen.getAllByTestId("fact-divider")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Créer la carte" })).toBeOnTheScreen();
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
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    await fireEvent.press(screen.getByRole("button", { name: "Créer la carte" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    const created = usePortfolioStore
      .getState()
      .cards.find((item) => item.name === "Loyer de Février");
    expect(created?.goal).toBe(60_000n);
    expect(created?.deadline).toBe(tomorrowUtc());
    expect(created?.markersTotal).toBeGreaterThan(0);
    expect(created?.tontineId).toBeNull();
    expect(router.push).toHaveBeenCalledWith(`/savings-detail/${created?.id ?? "absent"}`);
  });

  it("rattache la carte à la tontine choisie dans la liste", async () => {
    usePortfolioStore.setState({ tontines: [makeTontine({ id: "t1", name: "Les Amis" })] });
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);
    await fillProject();
    await chooseDeadline();

    await fireEvent.press(screen.getByLabelText("Tontine rattachée : Aucune tontine"));
    await fireEvent.press(screen.getByRole("button", { name: /^Les Amis,/ }));
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));
    expect(screen.getByText("Les Amis")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Créer la carte" }));

    const created = usePortfolioStore
      .getState()
      .cards.find((item) => item.name === "Loyer de Février");
    expect(created?.tontineId).toBe("t1");
  });

  it("refuse de passer au récapitulatif sans échéance", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={onClose} />);
    await fillProject("Assurance");

    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(screen.getByText("Choisissez une date d'échéance.")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar", { name: /Étape 2 sur 3/ })).toBeOnTheScreen();
    expect(onClose).not.toHaveBeenCalled();
  });
});
