import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { TontinesScreen } from "./tontines-screen";

describe("TontinesScreen", () => {
  it("affiche le titre et le nombre de tontines", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    expect(screen.getByRole("header", { name: "Mes tontines" })).toBeOnTheScreen();
    expect(screen.getByText("2 tontines en cours")).toBeOnTheScreen();
  });

  it("liste les tontines avec leur cotisation", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    expect(screen.getByText("Tontine du Marché Tolal")).toBeOnTheScreen();
    expect(screen.getByText("5 000 FCFA chaque semaine")).toBeOnTheScreen();
    expect(screen.getByText("Tontine des Amis")).toBeOnTheScreen();
  });

  it("affiche l'avancement et le bénéficiaire du tour", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    expect(screen.getByText("Tour 4 / 10")).toBeOnTheScreen();
    expect(screen.getByText("Mama Nadège")).toBeOnTheScreen();
  });
});
