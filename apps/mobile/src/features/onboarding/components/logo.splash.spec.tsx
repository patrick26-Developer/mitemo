import { render, screen } from "@testing-library/react-native";

import { SplashLogo } from "./logo.splash";

describe("SplashLogo", () => {
  it("pose les trois formes du logo, chacune animée à son tour", async () => {
    await render(<SplashLogo width={150} />);

    expect(screen.getByTestId("mitemo-logo")).toHaveStyle({ width: 150 });
    expect(screen.getByTestId("mitemo-logo-shape-0")).toBeOnTheScreen();
    expect(screen.getByTestId("mitemo-logo-shape-2")).toBeOnTheScreen();
  });
});
