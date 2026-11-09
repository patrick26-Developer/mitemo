import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { TontinesScreen } from "./tontines-screen";

describe("TontinesScreen", () => {
  it("affiche le filtre et les actions de la liste", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    expect(screen.getByRole("tab", { name: "Actives" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Rechercher" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Ajouter" })).toBeOnTheScreen();
  });

  it("liste les tontines actives par défaut", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    expect(screen.getByText("Tontine du Marché Tolal")).toBeOnTheScreen();
    expect(screen.getByText("5 000 FCFA chaque semaine")).toBeOnTheScreen();
    expect(screen.getByText("Tontine des Amis")).toBeOnTheScreen();
    expect(screen.queryByText("Tontine du Quartier")).not.toBeOnTheScreen();
  });

  it("affiche les tontines terminées quand on choisit leur filtre", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    fireEvent.press(screen.getByRole("tab", { name: "Terminées" }));

    expect(await screen.findByText("Tontine du Quartier")).toBeOnTheScreen();
    expect(screen.queryByText("Tontine du Marché Tolal")).not.toBeOnTheScreen();
  });

  it("affiche l'avancement et le bénéficiaire du tour", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    expect(screen.getByText("Tour 4 / 10")).toBeOnTheScreen();
    expect(screen.getByText("Mama Nadège")).toBeOnTheScreen();
  });
});
