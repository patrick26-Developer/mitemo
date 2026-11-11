import { render, screen } from "@testing-library/react-native";

import { StepIndicator } from "./indicator.step";

describe("StepIndicator", () => {
  it("annonce l'étape courante et son titre", async () => {
    await render(<StepIndicator index={0} total={2} title="L'essentiel" />);

    const progress = screen.getByRole("progressbar", { name: "Étape 1 sur 2 : L'essentiel" });
    expect(progress).toHaveAccessibilityValue({ min: 1, max: 2, now: 1 });
    expect(screen.getByText("Étape 1 sur 2")).toBeOnTheScreen();
    expect(screen.getByText("L'essentiel")).toBeOnTheScreen();
  });

  it("dessine un segment par étape, ceux déjà atteints remplis", async () => {
    await render(<StepIndicator index={1} total={3} title="Le cycle" />);

    expect(screen.getAllByTestId("step-segment-done")).toHaveLength(2);
    expect(screen.getAllByTestId("step-segment-todo")).toHaveLength(1);
  });
});
