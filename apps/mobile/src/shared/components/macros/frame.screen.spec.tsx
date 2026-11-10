import { Text } from "react-native";

import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { ScreenFrame } from "./frame.screen";

describe("ScreenFrame", () => {
  it("affiche le fond pointillé et son contenu", async () => {
    await renderWithSafeArea(
      <ScreenFrame>
        <Text>Contenu affiché</Text>
      </ScreenFrame>,
    );

    expect(screen.getByTestId("dotted-background")).toBeOnTheScreen();
    expect(screen.getByText("Contenu affiché")).toBeOnTheScreen();
  });
});
