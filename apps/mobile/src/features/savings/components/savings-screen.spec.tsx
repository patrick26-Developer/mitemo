import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { SavingsScreen } from "./savings-screen";

describe("SavingsScreen", () => {
  it("affiche le filtre et les actions de la liste", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByRole("tab", { name: "Actives" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Rechercher" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Ajouter" })).toBeOnTheScreen();
  });

  it("liste les cartes actives par défaut", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByText("Loyer de Janvier")).toBeOnTheScreen();
    expect(screen.getByText(/20 000/)).toBeOnTheScreen();
    expect(screen.getAllByText("Objectif")).toHaveLength(2);
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();
    expect(screen.queryByText("Fonds d'urgence")).not.toBeOnTheScreen();
  });

  it("affiche les cartes terminées quand on choisit leur filtre", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    fireEvent.press(screen.getByRole("tab", { name: "Terminées" }));

    expect(await screen.findByText("Fonds d'urgence")).toBeOnTheScreen();
    expect(screen.queryByText("Loyer de Janvier")).not.toBeOnTheScreen();
  });

  it("affiche l'échéance de chaque carte", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByText("Jusqu'au 31 Décembre 2026")).toBeOnTheScreen();
  });
});
