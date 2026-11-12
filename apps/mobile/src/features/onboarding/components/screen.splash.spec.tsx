import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SplashScreen } from "./screen.splash";

describe("SplashScreen", () => {
  it("montre le logo et la promesse de Mitemo au lancement", async () => {
    await renderWithSafeArea(<SplashScreen visible />);

    expect(screen.getByTestId("mitemo-logo")).toBeOnTheScreen();
    expect(screen.getByText("Tontines et épargne, en toute confiance")).toBeOnTheScreen();
  });

  it("disparaît une fois l'application prête", async () => {
    await renderWithSafeArea(<SplashScreen visible={false} />);

    expect(screen.queryByTestId("mitemo-logo")).toBeNull();
  });
});
