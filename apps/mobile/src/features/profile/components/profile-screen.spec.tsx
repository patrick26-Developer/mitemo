import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { ProfileScreen } from "./profile-screen";

describe("ProfileScreen", () => {
  it("affiche le membre connecté", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByRole("header", { name: "Précieuse" })).toBeOnTheScreen();
    expect(screen.getByText("+242 06 512 34 56")).toBeOnTheScreen();
  });

  it("regroupe les actions du profil", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByText("Mon compte")).toBeOnTheScreen();
    expect(screen.getByText("Préférences")).toBeOnTheScreen();
    expect(screen.getByText("Aide")).toBeOnTheScreen();
  });

  it("affiche les actions et la déconnexion", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByText("Mes informations")).toBeOnTheScreen();
    expect(screen.getByText("Centre d'aide")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Se déconnecter" })).toBeOnTheScreen();
  });
});
