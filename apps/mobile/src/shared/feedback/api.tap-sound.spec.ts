import { playFeedbackSound } from "./api.feedback-effects";
import { withTapSound } from "./api.tap-sound";
import { INITIAL_FEEDBACK_PREFERENCES, useFeedbackPreferences } from "./store.feedback-preferences";

jest.mock("./api.feedback-effects", () => ({ playFeedbackSound: jest.fn(async () => true) }));

describe("withTapSound", () => {
  beforeEach(() => {
    jest.mocked(playFeedbackSound).mockClear();
    useFeedbackPreferences.setState(INITIAL_FEEDBACK_PREFERENCES);
  });

  it("joue le son du bouton puis lance son action", () => {
    const action = jest.fn();

    withTapSound("pay", action)();

    expect(playFeedbackSound).toHaveBeenCalledWith("pay");
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("lance l'action en silence quand le membre a coupé les sons", () => {
    useFeedbackPreferences.setState({ sound: false });
    const action = jest.fn();

    withTapSound("add", action)();

    expect(playFeedbackSound).not.toHaveBeenCalled();
    expect(action).toHaveBeenCalledTimes(1);
  });
});
