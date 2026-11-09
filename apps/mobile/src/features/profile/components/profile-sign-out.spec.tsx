import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { ProfileSignOut } from "./profile-sign-out";

describe("ProfileSignOut", () => {
  it("affiche la date de création du compte", async () => {
    await renderWithSafeArea(<ProfileSignOut createdAt="2026-03-12" />);

    expect(screen.getByText("Compte créé le 12/03/2026")).toBeOnTheScreen();
  });

  it("propose la déconnexion", async () => {
    await renderWithSafeArea(<ProfileSignOut createdAt="2026-03-12" />);

    expect(screen.getByRole("button", { name: "Se déconnecter" })).toBeOnTheScreen();
  });
});
