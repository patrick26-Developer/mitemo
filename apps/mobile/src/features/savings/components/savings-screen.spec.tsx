import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { SavingsScreen } from "./savings-screen";

describe("SavingsScreen", () => {
  it("affiche le titre et le nombre de caisses", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByRole("header", { name: "Mes caisses" })).toBeOnTheScreen();
    expect(screen.getByText("2 caisses d'épargne")).toBeOnTheScreen();
  });

  it("liste les caisses avec leur montant et leur objectif", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByText("Loyer de Janvier")).toBeOnTheScreen();
    expect(screen.getByText(/20 000/)).toBeOnTheScreen();
    expect(screen.getByText("Objectif 30 000 FCFA")).toBeOnTheScreen();
  });

  it("affiche l'échéance de chaque caisse", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByText("Jusqu'au 31 Décembre 2026")).toBeOnTheScreen();
  });
});
