import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { ProfileFooter } from "./profile-footer";

describe("ProfileFooter", () => {
  it("affiche la date de création du compte au format JJ/MM/AAAA", async () => {
    await renderWithSafeArea(<ProfileFooter createdAt="2026-03-12" />);

    expect(screen.getByText("Compte créé le 12/03/2026")).toBeOnTheScreen();
  });

  it("affiche le nom de l'application", async () => {
    await renderWithSafeArea(<ProfileFooter createdAt="2026-03-12" />);

    expect(screen.getByText("Mitemo")).toBeOnTheScreen();
  });

  it("affiche la version de l'application", async () => {
    await renderWithSafeArea(<ProfileFooter createdAt="2026-03-12" />);

    expect(screen.getByText("version 0.0.0")).toBeOnTheScreen();
  });
});
