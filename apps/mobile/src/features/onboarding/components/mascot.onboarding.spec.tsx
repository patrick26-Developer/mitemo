import { render, screen } from "@testing-library/react-native";

import { OnboardingMascot } from "./mascot.onboarding";

describe("OnboardingMascot", () => {
  it("entoure Temo de ses amis pour parler des tontines", async () => {
    await render(<OnboardingMascot slideId="tontines" />);

    expect(screen.getByTestId("mascot-body", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByTestId("mascot-friends", { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it("met un téléphone dans la main de Temo pour parler des paiements", async () => {
    await render(<OnboardingMascot slideId="payment" />);

    expect(screen.getByTestId("mascot-phone", { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it("pose Temo à côté d'une pile de pièces pour parler d'épargne", async () => {
    await render(<OnboardingMascot slideId="savings" />);

    expect(screen.getByTestId("mascot-coins", { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it("reste décorative pour les lecteurs d'écran", async () => {
    await render(<OnboardingMascot slideId="savings" />);

    expect(
      screen.getByTestId("onboarding-mascot-savings", { includeHiddenElements: true }),
    ).toHaveProp("accessibilityElementsHidden", true);
  });
});
