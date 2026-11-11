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

  it("fait choisir la fréquence dans une liste, sans saisir d'intervalle", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);
    await fillEssentials();

    expect(
      screen.getByRole("progressbar", { name: "Étape 2 sur 3 : La fréquence" }),
    ).toBeOnTheScreen();
    expect(screen.queryByLabelText("Intervalle")).toBeNull();
    expect(screen.getByRole("button", { name: "Chaque semaine" })).toBeSelected();

    await fireEvent.press(screen.getByRole("button", { name: "Toutes les 2 semaines" }));

    expect(screen.getByRole("button", { name: "Toutes les 2 semaines" })).toBeSelected();
  });

  it("revient à l'étape précédente en gardant la saisie", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);
    await fillEssentials();

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(screen.getByDisplayValue("Tontine du Marché")).toBeOnTheScreen();
  });

  it("résume la cagnotte et crée la tontine à la dernière étape", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<TontineCreateSheet visible onClose={onClose} />);
    await fillEssentials();
    await fireEvent.press(screen.getByRole("button", { name: "Toutes les 2 semaines" }));
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(screen.getByText("Cagnotte par tour")).toBeOnTheScreen();
    expect(screen.getByText("25 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("toutes les 2 semaines")).toBeOnTheScreen();
    expect(screen.getByTestId("sheet-action-row")).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Créer la tontine" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    const created = usePortfolioStore
      .getState()
      .tontines.find((item) => item.name === "Tontine du Marché");
    expect(created?.frequency).toEqual({ unit: "semaine", interval: 2 });
  });

  it("refuse moins de tours que de participants à la dernière étape", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<TontineCreateSheet visible onClose={onClose} />);
    await fillEssentials();
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    await fireEvent.changeText(screen.getByLabelText("Tours"), "3");
    await fireEvent.press(screen.getByRole("button", { name: "Créer la tontine" }));

    expect(screen.getByText("Prévoyez au moins un tour par participant.")).toBeOnTheScreen();
    expect(onClose).not.toHaveBeenCalled();
  });
});
