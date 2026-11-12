import { fireEvent, render, screen } from "@testing-library/react-native";

import { firstOf } from "../../../shared/testing/fixtures.portfolio";
import { ONBOARDING_SLIDES } from "../model/model.onboarding-slides";
import { OnboardingCard } from "./card.onboarding";

/** Première page de la présentation. */
const FIRST = firstOf(ONBOARDING_SLIDES);

describe("OnboardingCard", () => {
  it("met « Passer » et « Suivant » sur une même ligne avant la dernière page", async () => {
    const onNext = jest.fn();
    await render(
      <OnboardingCard
        slide={FIRST}
        position={{ index: 0, total: 3 }}
        bottomInset={0}
        onNext={onNext}
        onFinish={jest.fn()}
      />,
    );

    expect(screen.getByTestId("sheet-action-row")).toHaveStyle({ flexDirection: "row" });
    await fireEvent.press(screen.getByRole("button", { name: "Suivant" }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("ne propose que « Commencer » sur la dernière page", async () => {
    const onFinish = jest.fn();
    await render(
      <OnboardingCard
        slide={FIRST}
        position={{ index: 2, total: 3 }}
        bottomInset={0}
        onNext={jest.fn()}
        onFinish={onFinish}
      />,
    );

    expect(screen.queryByRole("button", { name: "Suivant" })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Commencer" }));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
