import { render, screen } from "@testing-library/react-native";

import { StepIndicator } from "./indicator.step";

describe("StepIndicator", () => {
  it("annonce l'étape courante et son titre", async () => {
    await render(<StepIndicator index={0} total={2} title="L'essentiel" />);

    const progress = screen.getByRole("progressbar", { name: "Étape 1 sur 2 : L'essentiel" });
    expect(progress).toHaveAccessibilityValue({ min: 1, max: 2, now: 1 });
    expect(screen.queryByText("Étape 1 sur 2")).toBeNull();
    expect(screen.queryByText("L'essentiel")).toBeNull();
  });

  it("numérote les étapes et relie les pastilles", async () => {
    await render(<StepIndicator index={1} total={3} title="Le cycle" />);

    expect(screen.getByText("1")).toBeOnTheScreen();
    expect(screen.getByText("2")).toBeOnTheScreen();
    expect(screen.getByText("3")).toBeOnTheScreen();
    expect(screen.getAllByTestId("step-connector")).toHaveLength(2);
  });

  it("remplit les pastilles déjà atteintes", async () => {
    await render(<StepIndicator index={1} total={3} title="Le cycle" />);

    expect(screen.getAllByTestId("step-marker-done")).toHaveLength(2);
    expect(screen.getAllByTestId("step-marker-todo")).toHaveLength(1);
  });
});
