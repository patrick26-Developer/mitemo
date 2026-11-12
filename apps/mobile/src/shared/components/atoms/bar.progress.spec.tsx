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

  it("remplit la barre à la couleur d'action de l'écran", async () => {
    await render(<ProgressBar value={0.4} accent="#CFD8FF" />);

    expect(screen.getByTestId("progress-fill")).toHaveStyle({ backgroundColor: "#2044DF" });
    expect(screen.getByTestId("progress-track")).toHaveStyle({ backgroundColor: "#2044DF33" });
  });
});
