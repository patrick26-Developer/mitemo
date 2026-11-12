import { act, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SplashGate } from "./gate.splash";

describe("SplashGate", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("montre le lancement puis le retire une fois l'application prête", async () => {
    await renderWithSafeArea(<SplashGate />);
    expect(screen.getByTestId("splash-screen")).toBeOnTheScreen();

    await act(async () => {
      jest.advanceTimersByTime(1_400);
    });

    expect(screen.queryByTestId("splash-screen")).toBeNull();
  });
});
