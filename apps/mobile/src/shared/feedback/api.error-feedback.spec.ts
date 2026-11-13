import { playErrorHaptic, playFeedbackSound } from "./api.feedback-effects";
import { signalError } from "./api.error-feedback";
import { INITIAL_FEEDBACK_PREFERENCES, useFeedbackPreferences } from "./store.feedback-preferences";

jest.mock("./api.feedback-effects", () => ({
  playFeedbackSound: jest.fn(async () => true),
  playErrorHaptic: jest.fn(async () => true),
}));

describe("signalError", () => {
  beforeEach(() => {
    jest.mocked(playFeedbackSound).mockClear();
    jest.mocked(playErrorHaptic).mockClear();
    useFeedbackPreferences.setState(INITIAL_FEEDBACK_PREFERENCES);
  });

  it("joue le son d'erreur et fait vibrer le téléphone", () => {
    signalError();

    expect(playFeedbackSound).toHaveBeenCalledWith("error");
    expect(playErrorHaptic).toHaveBeenCalledTimes(1);
  });

  it("respecte les sons et les vibrations coupés par le membre", () => {
    useFeedbackPreferences.setState({ sound: false, vibration: false });

    signalError();

    expect(playFeedbackSound).not.toHaveBeenCalled();
    expect(playErrorHaptic).not.toHaveBeenCalled();
  });
});
