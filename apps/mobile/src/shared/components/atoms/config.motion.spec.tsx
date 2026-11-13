import { render, screen } from "@testing-library/react-native";

import { useFeedbackPreferences } from "../../feedback/store.feedback-preferences";
import { MotionConfig } from "./config.motion";

describe("MotionConfig", () => {
  it("se pose sans rien afficher, animations coupées ou non", async () => {
    useFeedbackPreferences.setState({ animations: false });
    await render(<MotionConfig />);

    expect(screen.toJSON()).toBeNull();
  });
});
