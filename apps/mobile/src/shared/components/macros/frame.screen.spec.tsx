import { Text } from "react-native";

import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { ScreenFrame } from "./frame.screen";

describe("ScreenFrame", () => {
  it("affiche son contenu sans fond pointillé", async () => {
    await renderWithSafeArea(
      <ScreenFrame>
        <Text>Contenu affiché</Text>
      </ScreenFrame>,
    );

    expect(screen.getByText("Contenu affiché")).toBeOnTheScreen();
    expect(screen.queryByTestId("dotted-background")).not.toBeOnTheScreen();
  });
});
