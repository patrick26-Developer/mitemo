import { fireEvent, screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsCreateSheet } from "./sheet.savings-create";

describe("SavingsCreateSheet", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("résume l'objectif et l'échéance à mesure de la saisie", async () => {
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={jest.fn()} />);

    await fireEvent.changeText(screen.getByLabelText("Montant d'un marqueur (FCFA)"), "5000");
    await fireEvent.changeText(screen.getByLabelText("Nombre de marqueurs"), "6");
    await fireEvent.changeText(screen.getByLabelText("Échéance (JJ/MM/AAAA)"), "31/12/2026");

    expect(screen.getByText("Récapitulatif")).toBeOnTheScreen();
    expect(screen.getByText("Objectif")).toBeOnTheScreen();
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("31 décembre 2026")).toBeOnTheScreen();
  });

  it("crée la carte et convertit l'échéance en date ISO", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={onClose} />);

    await fireEvent.changeText(screen.getByLabelText("Nom"), "Loyer de Février");
    await fireEvent.changeText(screen.getByLabelText("Montant d'un marqueur (FCFA)"), "5000");
    await fireEvent.changeText(screen.getByLabelText("Nombre de marqueurs"), "6");
    await fireEvent.changeText(screen.getByLabelText("Échéance (JJ/MM/AAAA)"), "28/02/2027");
    await fireEvent.press(screen.getByRole("button", { name: "Créer la carte" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    const created = usePortfolioStore
      .getState()
      .cards.find((item) => item.name === "Loyer de Février");
    expect(created?.deadline).toBe("2027-02-28");
    expect(created?.markersTotal).toBe(6);
  });

  it("refuse une échéance invalide", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SavingsCreateSheet visible onClose={onClose} />);

    await fireEvent.changeText(screen.getByLabelText("Nom"), "Assurance");
    await fireEvent.changeText(screen.getByLabelText("Montant d'un marqueur (FCFA)"), "5000");
    await fireEvent.changeText(screen.getByLabelText("Échéance (JJ/MM/AAAA)"), "30/02/2027");
    await fireEvent.press(screen.getByRole("button", { name: "Créer la carte" }));

    expect(screen.getByText("Saisissez une échéance au format JJ/MM/AAAA.")).toBeOnTheScreen();
    expect(onClose).not.toHaveBeenCalled();
  });
});
