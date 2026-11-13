import {
  FEEDBACK_OPTIONS,
  INITIAL_FEEDBACK_PREFERENCES,
  useFeedbackPreferences,
} from "./store.feedback-preferences";

describe("useFeedbackPreferences", () => {
  beforeEach(() => useFeedbackPreferences.setState(INITIAL_FEEDBACK_PREFERENCES));

  it("active par défaut le son, les confettis, les vibrations et les animations", () => {
    expect(INITIAL_FEEDBACK_PREFERENCES).toEqual({
      sound: true,
      confetti: true,
      vibration: true,
      animations: true,
    });
  });

  it("coupe puis rallume une préférence, sans toucher aux autres", () => {
    useFeedbackPreferences.getState().toggle("sound");

    expect(useFeedbackPreferences.getState().sound).toBe(false);
    expect(useFeedbackPreferences.getState().confetti).toBe(true);

    useFeedbackPreferences.getState().toggle("sound");

    expect(useFeedbackPreferences.getState().sound).toBe(true);
  });

  it("décrit chaque préférence pour la page profil", () => {
    expect(FEEDBACK_OPTIONS.map((option) => option.key)).toEqual([
      "sound",
      "confetti",
      "vibration",
      "animations",
    ]);
  });
});
