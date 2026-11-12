import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { StepTransition } from "./transition.step";

describe("StepTransition", () => {
  it("montre le contenu de l'étape courante", async () => {
    await render(
      <StepTransition index={0}>
        <Text>{"L'essentiel"}</Text>
      </StepTransition>,
    );

    expect(screen.getByText("L'essentiel")).toBeOnTheScreen();
  });

  it("remplace le contenu à chaque changement d'étape, pour le faire glisser", async () => {
    const { rerender } = await render(
      <StepTransition index={0}>
        <Text>{"L'essentiel"}</Text>
      </StepTransition>,
    );

    await rerender(
      <StepTransition index={1}>
        <Text>Le rythme</Text>
      </StepTransition>,
    );

    expect(screen.getByTestId("step-transition-1")).toHaveTextContent("Le rythme");
    expect(screen.queryByText("L'essentiel")).toBeNull();
  });
});
