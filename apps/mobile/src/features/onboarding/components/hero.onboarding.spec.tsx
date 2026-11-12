import { render, screen } from "@testing-library/react-native";

import { OnboardingHero } from "./hero.onboarding";

describe("OnboardingHero", () => {
  it("montre le logo et l'icône de la page courante", async () => {
    await render(<OnboardingHero slideId="payment" topInset={0} />);

    expect(screen.getByTestId("mitemo-logo")).toBeOnTheScreen();
    expect(screen.getByTestId("onboarding-icon-payment")).toBeOnTheScreen();
  });
});
