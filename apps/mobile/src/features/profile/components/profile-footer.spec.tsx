import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { ProfileFooter } from "./profile-footer";

describe("ProfileFooter", () => {
  it("affiche l'année de création du compte", async () => {
    await renderWithSafeArea(<ProfileFooter createdAt="2026" />);

    expect(screen.getByText("Compte créé en 2026")).toBeOnTheScreen();
  });

  it("affiche le nom et la version de l'application", async () => {
    await renderWithSafeArea(<ProfileFooter createdAt="2026" />);

    expect(screen.getByText(/^Mitemo /)).toBeOnTheScreen();
  });
});
