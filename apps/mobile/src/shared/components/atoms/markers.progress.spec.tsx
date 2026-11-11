import { render, screen } from "@testing-library/react-native";

import { MarkerProgress } from "./markers.progress";

describe("MarkerProgress", () => {
  it("décrit la progression aux lecteurs d'écran", async () => {
    await render(<MarkerProgress done={3} total={6} />);

    const progress = screen.getByRole("progressbar", { name: "3 marqueurs validés sur 6" });
    expect(progress).toHaveAccessibilityValue({ min: 0, max: 6, now: 3 });
    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it("résume les marqueurs au-delà de dix", async () => {
    await render(<MarkerProgress done={2} total={14} />);

    expect(screen.getByText("+4")).toBeOnTheScreen();
  });
});
