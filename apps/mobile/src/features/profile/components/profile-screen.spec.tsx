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

  it("propose l'historique et le choix du thème", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByRole("button", { name: "Historique" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Thème" })).toBeOnTheScreen();
  });

  it("affiche le nom du thème courant", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByText("Système")).toBeOnTheScreen();
  });

  it("affiche les documents légaux", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByRole("button", { name: "Politique de confidentialité" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Conditions d'utilisation" })).toBeOnTheScreen();
  });

  it("permet de modifier la photo de profil", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByRole("button", { name: "Modifier la photo" })).toBeOnTheScreen();
  });

  it("affiche la création du compte et l'identité de l'application", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByText("Compte créé le 12/03/2026")).toBeOnTheScreen();
    expect(screen.getByText("Mitemo")).toBeOnTheScreen();
    expect(screen.getByText("version 0.0.0")).toBeOnTheScreen();
  });

  it("n'affiche plus l'ancienneté dans l'en-tête", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.queryByText(/Membre depuis/)).not.toBeOnTheScreen();
  });
});
