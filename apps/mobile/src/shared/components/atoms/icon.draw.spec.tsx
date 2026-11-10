import { render, screen } from "@testing-library/react-native";

import { DrawIcon } from "./icon.draw";

describe("DrawIcon", () => {
  it("expose son identifiant de test", async () => {
    await render(<DrawIcon testID="draw-icon" paths={["M0 0L1 1"]} color="#000000" />);

    expect(screen.getByTestId("draw-icon")).toBeOnTheScreen();
  });

  it("reste décoratif pour les lecteurs d'écran", async () => {
    await render(<DrawIcon testID="draw-icon" paths={["M0 0L1 1"]} color="#000000" />);

    expect(screen.getByTestId("draw-icon").props["accessible"]).toBe(false);
  });
});
