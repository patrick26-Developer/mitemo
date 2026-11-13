import { fireEvent, render, screen } from "@testing-library/react-native";

import {
  INITIAL_FEEDBACK_PREFERENCES,
  useFeedbackPreferences,
} from "../../../../shared/feedback/store.feedback-preferences";
import { EffectsSheet } from "./sheet.effects";

describe("EffectsSheet", () => {
  beforeEach(() => useFeedbackPreferences.setState(INITIAL_FEEDBACK_PREFERENCES));

  it("montre le son, les confettis, les vibrations et les animations, tous activés", async () => {
    await render(<EffectsSheet />);

    for (const label of ["Sons", "Confettis", "Vibrations", "Animations"]) {
      expect(screen.getByLabelText(label)).toHaveProp("value", true);
    }
  });

  it("coupe les confettis", async () => {
    await render(<EffectsSheet />);

    await fireEvent(screen.getByLabelText("Confettis"), "valueChange", false);

    expect(useFeedbackPreferences.getState().confetti).toBe(false);
  });
});
