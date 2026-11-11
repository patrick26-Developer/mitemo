import { render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import { HatchPattern } from "./pattern.hatch";

describe("HatchPattern", () => {
  it("se rend avec ou sans largeur explicite", async () => {
    await render(
      <View testID="hatches">
        <HatchPattern />
        <HatchPattern width={120} height={20} />
      </View>,
    );

    expect(screen.getByTestId("hatches")).toBeOnTheScreen();
  });
});
