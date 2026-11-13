import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SplashScreen } from "./screen.splash";

describe("SplashScreen", () => {
  it("dessine le logo forme par forme, avec la promesse de Mitemo", async () => {
    await renderWithSafeArea(<SplashScreen visible />);

    expect(screen.getByTestId("mitemo-logo")).toBeOnTheScreen();
    expect(screen.getAllByTestId(/^mitemo-logo-shape-/)).toHaveLength(3);
    expect(screen.getByText("Tontines et épargne, en toute confiance")).toBeOnTheScreen();
  });

  it("signe l'écran du nom MITEMO en bas, comme une marque", async () => {
    await renderWithSafeArea(<SplashScreen visible />);

    expect(screen.getByText("de")).toBeOnTheScreen();
    expect(screen.getByText("MITEMO")).toBeOnTheScreen();
  });

  it("disparaît une fois l'application prête", async () => {
    await renderWithSafeArea(<SplashScreen visible={false} />);

    expect(screen.queryByTestId("mitemo-logo")).toBeNull();
  });
});
