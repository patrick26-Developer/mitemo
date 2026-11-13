import { act, screen } from "@testing-library/react-native";
import { Vibration } from "react-native";

import { useCelebrationStore } from "../../feedback/store.celebration";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { CELEBRATION_MS, CelebrationHost } from "./host.celebration";

describe("CelebrationHost", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Vibration, "vibrate").mockImplementation(() => undefined);
    useCelebrationStore.setState({ burst: null });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("ne montre rien sans célébration", async () => {
    await renderWithSafeArea(<CelebrationHost />);

    expect(screen.queryByTestId("celebration-host")).toBeNull();
  });

  it("fait pleuvoir les confettis sans bloquer les touchers, et vibre", async () => {
    await renderWithSafeArea(<CelebrationHost />);

    await act(() => useCelebrationStore.getState().celebrate());

    expect(screen.getByTestId("celebration-host")).toHaveProp("pointerEvents", "none");
    expect(screen.getAllByTestId("confetti-piece").length).toBeGreaterThan(20);
    expect(Vibration.vibrate).toHaveBeenCalledTimes(1);
  });

  it("s'efface une fois la pluie finie", async () => {
    await renderWithSafeArea(<CelebrationHost />);
    await act(() => useCelebrationStore.getState().celebrate());

    await act(() => jest.advanceTimersByTimeAsync(CELEBRATION_MS));

    expect(screen.queryByTestId("celebration-host")).toBeNull();
    expect(useCelebrationStore.getState().burst).toBeNull();
  });
});
