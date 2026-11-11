import { fireEvent, screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineCreateSheet } from "./sheet.tontine-create";

describe("TontineCreateSheet", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("résume la cagnotte à mesure de la saisie", async () => {
    await renderWithSafeArea(<TontineCreateSheet visible onClose={jest.fn()} />);

    await fireEvent.changeText(screen.getByLabelText("Cotisation par tour (FCFA)"), "5000");

    expect(screen.getByText("Récapitulatif")).toBeOnTheScreen();
    expect(screen.getByText("Cagnotte par tour")).toBeOnTheScreen();
    expect(screen.getByText("25 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("chaque semaine")).toBeOnTheScreen();
  });

  it("crée la tontine et ferme la feuille", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<TontineCreateSheet visible onClose={onClose} />);

    await fireEvent.changeText(screen.getByLabelText("Nom"), "Tontine du Marché");
    await fireEvent.changeText(screen.getByLabelText("Cotisation par tour (FCFA)"), "5000");
    await fireEvent.changeText(screen.getByLabelText("Intervalle"), "2");
    await fireEvent.press(screen.getByRole("button", { name: "Créer la tontine" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    const created = usePortfolioStore
      .getState()
      .tontines.find((item) => item.name === "Tontine du Marché");
    expect(created?.frequency).toEqual({ unit: "semaine", interval: 2 });
  });

  it("refuse une saisie incomplète", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<TontineCreateSheet visible onClose={onClose} />);

    await fireEvent.press(screen.getByRole("button", { name: "Créer la tontine" }));

    expect(screen.getByText("Donnez un nom à la tontine.")).toBeOnTheScreen();
    expect(onClose).not.toHaveBeenCalled();
  });
});
