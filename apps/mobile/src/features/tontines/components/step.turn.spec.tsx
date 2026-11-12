import { render, screen } from "@testing-library/react-native";

import { TurnStep } from "./step.turn";

describe("TurnStep", () => {
  it("affiche le rang et le relie au suivant par un trait vertical", async () => {
    await render(<TurnStep turn={1} last={false} />);

    expect(screen.getByLabelText("Tour 1")).toBeOnTheScreen();
    expect(screen.getByTestId("turn-connector")).toBeOnTheScreen();
  });

  it("n'a pas de trait après le dernier rang", async () => {
    await render(<TurnStep turn={4} last />);

    expect(screen.queryByTestId("turn-connector")).toBeNull();
  });

  it("grise un rang ordinaire : contour seul, sans fond", async () => {
    await render(<TurnStep turn={3} last={false} />);

    expect(screen.getByLabelText("Tour 3")).toHaveStyle({ backgroundColor: "transparent" });
  });

  it("cercle le rang du tour en cours de la couleur de la tontine, sans le remplir", async () => {
    await render(<TurnStep turn={2} last={false} accent="#2044DF" />);

    const step = screen.getByLabelText("Tour 2");
    expect(step).toHaveStyle({ borderColor: "#2044DF", backgroundColor: "transparent" });
  });
});
