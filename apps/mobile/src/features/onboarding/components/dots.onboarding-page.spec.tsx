import { render, screen } from "@testing-library/react-native";

import { OnboardingPageDots } from "./dots.onboarding-page";

describe("OnboardingPageDots", () => {
  it("annonce la page courante", async () => {
    await render(<OnboardingPageDots index={1} total={3} />);

    expect(screen.getByLabelText("Page 2 sur 3")).toBeOnTheScreen();
  });
});
