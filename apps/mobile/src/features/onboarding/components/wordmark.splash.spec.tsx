import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SplashWordmark } from "./wordmark.splash";

describe("SplashWordmark", () => {
  it("écrit « de MITEMO » en bas de l'écran", async () => {
    await renderWithSafeArea(<SplashWordmark />);

    expect(screen.getByText("de")).toBeOnTheScreen();
    expect(screen.getByText("MITEMO")).toBeOnTheScreen();
  });
});
