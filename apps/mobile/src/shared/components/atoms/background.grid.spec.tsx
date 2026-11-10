import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { GridBackground } from "./background.grid";

describe("GridBackground", () => {
  it("pose le quadrillage derrière le contenu", async () => {
    await renderWithSafeArea(<GridBackground />);

    expect(screen.getByTestId("grid-background")).toBeOnTheScreen();
  });

  it("accepte un identifiant de test propre à l'écran", async () => {
    await renderWithSafeArea(<GridBackground testID="auth-grid" />);

    expect(screen.getByTestId("auth-grid")).toBeOnTheScreen();
  });
});
