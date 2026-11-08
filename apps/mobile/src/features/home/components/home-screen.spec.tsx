import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { HomeScreen } from "./home-screen";

describe("HomeScreen", () => {
  it("salue le membre connecté", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByText("Bonjour")).toBeOnTheScreen();
    expect(screen.getByText("Précieuse")).toBeOnTheScreen();
  });

  it("affiche le solde disponible et le montant mis de côté", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByText("Solde disponible")).toBeOnTheScreen();
    expect(screen.getByText(/12 500/)).toBeOnTheScreen();
    expect(screen.getByText("2 500 FCFA")).toBeOnTheScreen();
  });

  it("liste les tontines du membre", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByText("Mes Tontines")).toBeOnTheScreen();
    expect(screen.getByText("Tontine du Marché Tolal")).toBeOnTheScreen();
    expect(screen.getByText("Tour 4 / 10")).toBeOnTheScreen();
  });

  it("liste les caisses du membre", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByText("Mes caisses")).toBeOnTheScreen();
    expect(screen.getByText("Loyer de Janvier")).toBeOnTheScreen();
  });
});
