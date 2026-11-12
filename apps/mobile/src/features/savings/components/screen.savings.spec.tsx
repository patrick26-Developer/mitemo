import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsScreen } from "./screen.savings";

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

  it("affiche les cartes retirées quand on choisit leur filtre", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    fireEvent.press(screen.getByRole("tab", { name: "Retirées" }));

    expect(await screen.findByText("Fonds d'urgence")).toBeOnTheScreen();
    expect(screen.queryByText("Loyer de Janvier")).not.toBeOnTheScreen();
  });

  it("filtre les cartes avec la recherche de la liste", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    fireEvent.press(screen.getByRole("button", { name: "Rechercher" }));
    fireEvent.changeText(await screen.findByPlaceholderText("Rechercher une carte"), "santé");

    expect(screen.getByText("Assurance santé")).toBeOnTheScreen();
    await waitFor(() => expect(screen.queryByText("Loyer de Janvier")).not.toBeOnTheScreen());
  });

  it("ouvre la feuille de création depuis le bouton plus", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    fireEvent.press(screen.getByRole("button", { name: "Ajouter" }));

    expect(await screen.findByText("Nouvelle carte")).toBeOnTheScreen();
  });

  it("affiche l'échéance de chaque carte", async () => {
    await renderWithSafeArea(<SavingsScreen />);

    expect(screen.getByText("Jusqu'au 31 décembre 2026")).toBeOnTheScreen();
  });
});
