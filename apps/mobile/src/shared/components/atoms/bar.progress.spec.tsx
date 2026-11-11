import { render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import { ProgressBar } from "./bar.progress";

describe("ProgressBar", () => {
  it("se rend pour une progression partielle", async () => {
    await render(
      <View testID="progress">
        <ProgressBar value={0.4} />
      </View>,
    );

    expect(screen.getByTestId("progress")).toBeOnTheScreen();
  });
});
