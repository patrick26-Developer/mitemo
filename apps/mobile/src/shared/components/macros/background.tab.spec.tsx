import { render, screen } from "@testing-library/react-native";

import { TAB_GRID_LINE, TabBackground } from "./background.tab";

describe("TabBackground", () => {
  it("pose un quadrillage discret derrière le haut de l'écran, fondu dans le blanc", async () => {
    await render(<TabBackground />);

    expect(screen.getByTestId("tab-background")).toHaveStyle({ position: "absolute", top: 0 });
    expect(screen.getByTestId("tab-background-grid")).toBeOnTheScreen();
    expect(screen.getByTestId("tab-background-fade")).toBeOnTheScreen();
    expect(TAB_GRID_LINE).toMatch(/^rgba\(/);
  });
});
