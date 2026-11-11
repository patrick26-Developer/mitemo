import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { FloatDock } from "./dock.float";

describe("FloatDock", () => {
  it("ne rend rien sans action ni retour", async () => {
    await renderWithSafeArea(<FloatDock action={null} />);

    expect(screen.queryByTestId("float-dock")).toBeNull();
  });

  it("déclenche l'action pressée", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(<FloatDock action={{ label: "Continuer", onPress }} />);

    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("affiche le retour d'opération au-dessus de l'action", async () => {
    await renderWithSafeArea(
      <FloatDock
        action={null}
        notice={{ kind: "error", message: "Action impossible pour l'instant." }}
      />,
    );

    expect(screen.getByText("Action impossible pour l'instant.")).toBeOnTheScreen();
  });
});
