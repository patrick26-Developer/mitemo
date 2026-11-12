import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontinesScreen } from "./screen.tontines";

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

  it("filtre les tontines avec la recherche de la liste", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    fireEvent.press(screen.getByRole("button", { name: "Rechercher" }));
    fireEvent.changeText(await screen.findByPlaceholderText("Rechercher une tontine"), "amis");

    expect(screen.getByText("Tontine des Amis")).toBeOnTheScreen();
    await waitFor(() =>
      expect(screen.queryByText("Tontine du Marché Tolal")).not.toBeOnTheScreen(),
    );
  });

  it("ouvre la feuille de création depuis le bouton plus", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    fireEvent.press(screen.getByRole("button", { name: "Ajouter" }));

    expect(await screen.findByText("Nouvelle tontine")).toBeOnTheScreen();
    expect(screen.getByText("Étape 1 sur 4")).toBeOnTheScreen();
  });

  it("n'affiche pas de fond pointillé", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    expect(screen.queryByTestId("dotted-background")).not.toBeOnTheScreen();
  });

  it("affiche l'avancement et le bénéficiaire du tour", async () => {
    await renderWithSafeArea(<TontinesScreen />);

    expect(screen.getByText("Tour 4 / 10")).toBeOnTheScreen();
    expect(screen.getByText("Jean-Baptiste Okemba")).toBeOnTheScreen();
  });
});
