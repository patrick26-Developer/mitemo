import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { SavingsScreen } from "./savings-screen";

describe("SavingsScreen", () => {
  it("affiche le titre et le nombre de cartes de pointage", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByRole("header", { name: "Mes cartes de pointage" })).toBeOnTheScreen();
    expect(screen.getByText("2 cartes de pointage")).toBeOnTheScreen();
  });

  it("liste les cartes avec leur montant et leur objectif", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByText("Loyer de Janvier")).toBeOnTheScreen();
    expect(screen.getByText(/20 000/)).toBeOnTheScreen();
    expect(screen.getAllByText("Objectif")).toHaveLength(2);
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();
  });

  it("affiche l'échéance de chaque carte", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByText("Jusqu'au 31 Décembre 2026")).toBeOnTheScreen();
  });
});
