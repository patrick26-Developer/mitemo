import { act, screen } from "@testing-library/react-native";

import {
  INITIAL_FEEDBACK_PREFERENCES,
  useFeedbackPreferences,
} from "../../feedback/store.feedback-preferences";
import { playFeedbackSound, playSuccessHaptic } from "../../feedback/api.feedback-effects";
import { useCelebrationStore } from "../../feedback/store.celebration";
import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { CELEBRATION_MS, CelebrationHost } from "./host.celebration";

jest.mock("../../feedback/api.feedback-effects", () => ({
  playFeedbackSound: jest.fn(async () => true),
  playSuccessHaptic: jest.fn(async () => true),
}));

describe("CelebrationHost", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(playSuccessHaptic).mockClear();
    jest.mocked(playFeedbackSound).mockClear();
    useCelebrationStore.setState({ burst: null });
    useFeedbackPreferences.setState(INITIAL_FEEDBACK_PREFERENCES);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("ne montre rien sans célébration", async () => {
    await renderWithSafeArea(<CelebrationHost />);

    expect(screen.queryByTestId("celebration-host")).toBeNull();
  });

  it("fait pleuvoir les confettis sans bloquer les touchers, sonne et vibre", async () => {
    await renderWithSafeArea(<CelebrationHost />);

    await act(() => useCelebrationStore.getState().celebrate());

    expect(screen.getByTestId("celebration-host")).toHaveProp("pointerEvents", "none");
    expect(screen.getAllByTestId("confetti-piece").length).toBeGreaterThan(20);
    expect(playSuccessHaptic).toHaveBeenCalledTimes(1);
    expect(playFeedbackSound).toHaveBeenCalledWith("success");
  });

  it("s'efface une fois la pluie finie", async () => {
    await renderWithSafeArea(<CelebrationHost />);
    await act(() => useCelebrationStore.getState().celebrate());

    await act(() => jest.advanceTimersByTimeAsync(CELEBRATION_MS));

    expect(screen.queryByTestId("celebration-host")).toBeNull();
    expect(useCelebrationStore.getState().burst).toBeNull();
  });
  it("ne fait ni confettis, ni son, ni vibration quand le membre les a coupés", async () => {
    useFeedbackPreferences.setState({ confetti: false, vibration: false, sound: false });
    await renderWithSafeArea(<CelebrationHost />);

    await act(() => useCelebrationStore.getState().celebrate());

    expect(screen.queryAllByTestId("confetti-piece")).toHaveLength(0);
    expect(playSuccessHaptic).not.toHaveBeenCalled();
    expect(playFeedbackSound).not.toHaveBeenCalled();
  });
});
