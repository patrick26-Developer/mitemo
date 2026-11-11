import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { NoisePattern } from "./pattern.noise";

describe("NoisePattern", () => {
  it("pose le motif de bruit sans capter les touchers", async () => {
    await renderWithSafeArea(<NoisePattern />);

    expect(screen.getByTestId("noise-pattern").props["pointerEvents"]).toBe("none");
  });
});
