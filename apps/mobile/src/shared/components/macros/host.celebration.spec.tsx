import { act, screen } from "@testing-library/react-native";
import { Vibration } from "react-native";

import {
  INITIAL_FEEDBACK_PREFERENCES,
  useFeedbackPreferences,
} from "../../feedback/store.feedback-preferences";
import { useCelebrationStore } from "../../feedback/store.celebration";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { CELEBRATION_MS, CelebrationHost } from "./host.celebration";

describe("CelebrationHost", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest
      .spyOn(Vibration, "vibrate")
      .mockImplementation(() => undefined)
      .mockClear();
    useCelebrationStore.setState({ burst: null });
    useFeedbackPreferences.setState(INITIAL_FEEDBACK_PREFERENCES);
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
  it("ne fait ni confettis ni vibration quand le membre les a coupés", async () => {
    useFeedbackPreferences.setState({ confetti: false, vibration: false });
    await renderWithSafeArea(<CelebrationHost />);

    await act(() => useCelebrationStore.getState().celebrate());

    expect(screen.queryAllByTestId("confetti-piece")).toHaveLength(0);
    expect(Vibration.vibrate).not.toHaveBeenCalled();
  });
});
