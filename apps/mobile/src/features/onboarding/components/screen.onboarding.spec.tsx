import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { useOnboardingStore } from "../model/store.onboarding";
import { OnboardingScreen } from "./screen.onboarding";

describe("OnboardingScreen", () => {
  beforeEach(() => {
    useOnboardingStore.setState({ completed: false });
  });

  it("ouvre sur la première page, avec son indicateur", async () => {
    await renderWithSafeArea(<OnboardingScreen />);

    expect(screen.getByRole("header", { name: "Vos tontines, sans cahier" })).toBeOnTheScreen();
    expect(screen.getByLabelText("Page 1 sur 3")).toBeOnTheScreen();
  });

  it("passe d'une page à l'autre puis termine sur « Commencer »", async () => {
    await renderWithSafeArea(<OnboardingScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Suivant" }));
    expect(screen.getByRole("header", { name: "Cotisez en un geste" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Suivant" }));
    expect(screen.queryByRole("button", { name: "Passer" })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Commencer" }));

    expect(useOnboardingStore.getState().completed).toBe(true);
  });

  it("laisse passer la présentation dès la première page", async () => {
    await renderWithSafeArea(<OnboardingScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Passer" }));

    expect(useOnboardingStore.getState().completed).toBe(true);
  });
});
