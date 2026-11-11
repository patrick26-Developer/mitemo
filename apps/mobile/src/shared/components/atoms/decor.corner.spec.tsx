import { render, screen } from "@testing-library/react-native";

import { CornerDecor } from "./decor.corner";

describe("CornerDecor", () => {
  it("reste décoratif et ne capte pas les touchers", async () => {
    await render(<CornerDecor side="left" />);

    expect(screen.getByTestId("corner-decor-left").props["pointerEvents"]).toBe("none");
  });

  it("se retourne en miroir à droite", async () => {
    await render(<CornerDecor side="right" color="#FFFFFF" />);

    expect(screen.getByTestId("corner-decor-right")).toHaveStyle({
      transform: [{ scaleX: -1 }],
    });
  });
});
