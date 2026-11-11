import { fireEvent, render, screen } from "@testing-library/react-native";

import { DrawIcon } from "./icon.draw";

/** Événement de mise en page d'une icône de 20 points. */
const LAYOUT_EVENT = { nativeEvent: { layout: { x: 0, y: 0, width: 20, height: 20 } } };

/** Traits d'une icône de test, dessinés l'un après l'autre. */
const PATHS = ["M0 0L1 1", "M1 1L2 2"];

describe("DrawIcon", () => {
  it("expose son identifiant de test", async () => {
    await render(<DrawIcon testID="draw-icon" paths={PATHS} color="#000000" />);

    expect(screen.getByTestId("draw-icon")).toBeOnTheScreen();
  });

  it("reste décoratif pour les lecteurs d'écran", async () => {
    await render(<DrawIcon testID="draw-icon" paths={PATHS} color="#000000" />);

    expect(screen.getByTestId("draw-icon").props["accessible"]).toBe(false);
  });

  it("ne mesure les traits qu'après la mise en page native", async () => {
    await render(<DrawIcon testID="draw-icon" paths={PATHS} color="#000000" />);

    expect(screen.getByTestId("draw-icon")).toBeOnTheScreen();

    fireEvent(screen.getByTestId("draw-icon"), "layout", LAYOUT_EVENT);

    expect(screen.getByTestId("draw-icon")).toBeOnTheScreen();
  });

  it("dessine chaque trait fourni", async () => {
    await render(
      <DrawIcon
        testID="draw-icon"
        paths={PATHS}
        color="#000000"
        delay={100}
        stagger={40}
        duration={300}
      />,
    );

    fireEvent(screen.getByTestId("draw-icon"), "layout", LAYOUT_EVENT);

    expect(screen.getByTestId("draw-icon")).toBeOnTheScreen();
  });
});
