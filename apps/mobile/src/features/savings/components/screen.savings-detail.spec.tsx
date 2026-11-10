import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsDetailScreen } from "./screen.savings-detail";

describe("SavingsDetailScreen", () => {
  it("affiche la carte demandée", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    expect(screen.getByRole("header", { name: "Loyer de Janvier" })).toBeOnTheScreen();
    expect(screen.getByText(/20 000/)).toBeOnTheScreen();
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();
  });

  it("affiche l'échéance et le reste à épargner", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    expect(screen.getByText("31 Décembre 2026")).toBeOnTheScreen();
    expect(screen.getByText("10 000 FCFA")).toBeOnTheScreen();
  });

  it("affiche un état vide quand la carte n'existe pas", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="inconnue" />);

    expect(screen.getByText("Carte introuvable")).toBeOnTheScreen();
  });
});
