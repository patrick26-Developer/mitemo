import { fireEvent, screen } from "@testing-library/react-native";

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

describe("TontineCreateSheet", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("commence à l'étape 1 sur 4, sans bouton Annuler", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);

    expect(
      screen.getByRole("progressbar", { name: "Étape 1 sur 4 : L'essentiel" }),
    ).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
  });

  it("reste à la première étape tant que le nom manque", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(screen.getByText("Donnez un nom à la tontine.")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar", { name: /Étape 1 sur 4/ })).toBeOnTheScreen();
  });

  it("fait choisir la fréquence dans une liste groupée, sans saisir d'intervalle", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);
    await fillEssentials();

    expect(
      screen.getByRole("progressbar", { name: "Étape 2 sur 4 : La fréquence" }),
    ).toBeOnTheScreen();
    expect(screen.queryByLabelText("Intervalle")).toBeNull();
    expect(screen.getByLabelText("Fréquence des tours : Chaque semaine")).toBeOnTheScreen();

    await chooseCadence("Toutes les 2 semaines");

    expect(screen.getByLabelText("Fréquence des tours : Toutes les 2 semaines")).toBeOnTheScreen();
  });

  it("règle les participants au compteur et les déduit des tours", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);
    await fillEssentials();
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(
      screen.getByRole("progressbar", { name: "Étape 3 sur 4 : Les participants" }),
    ).toBeOnTheScreen();
    expect(screen.queryByLabelText("Tours")).toBeNull();

    await fireEvent.press(screen.getByLabelText("Augmenter Participants"));
    await fireEvent.press(screen.getByLabelText("Augmenter Participants"));

    expect(screen.getByLabelText("Participants : 8")).toBeOnTheScreen();
  });

  it("revient à l'étape précédente en gardant la saisie", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);
    await fillEssentials();

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(screen.getByDisplayValue("Tontine du Marché")).toBeOnTheScreen();
  });

  it("résume tout avant de confirmer, puis laisse inviter les membres", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<TontineCreateSheet visible onClose={onClose} />);
    await fillEssentials();
    await chooseCadence("Toutes les 2 semaines");
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(
      screen.getByRole("progressbar", { name: "Étape 4 sur 4 : Le récapitulatif" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("Tontine du Marché")).toBeOnTheScreen();
    expect(screen.getByText("toutes les 2 semaines")).toBeOnTheScreen();
    expect(screen.getByText("6 membres")).toBeOnTheScreen();
    expect(screen.getByText("25 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Confirmer" }));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText("Votre tontine est prête")).toBeOnTheScreen();
    const created = usePortfolioStore
      .getState()
      .tontines.find((item) => item.name === "Tontine du Marché");
    expect(created?.frequency).toEqual({ unit: "semaine", interval: 2 });
    expect(created?.totalRounds).toBe(6);

    await fireEvent.press(screen.getByRole("button", { name: "Inviter un membre" }));

    expect(screen.getByTestId("tontine-invitation-code")).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Terminer" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
