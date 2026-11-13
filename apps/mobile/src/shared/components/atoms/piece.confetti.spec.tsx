import { render, screen } from "@testing-library/react-native";

import { ConfettiPiece } from "./piece.confetti";

/** Confetti rectangulaire parti du milieu de l'écran. */
const PIECE = {
  x: 0.5,
  delay: 0,
  duration: 2000,
  drift: 30,
  spin: 360,
  width: 8,
  square: false,
  color: "#083EDF",
} as const;

describe("ConfettiPiece", () => {
  it("part de sa position, à sa couleur, deux fois plus large que haut", async () => {
    await render(<ConfettiPiece piece={PIECE} area={{ width: 400, height: 800 }} />);

    expect(screen.getByTestId("confetti-piece")).toHaveStyle({
      left: 200,
      width: 8,
      height: 4,
      backgroundColor: "#083EDF",
    });
  });

  it("dessine un carré quand le tirage le veut", async () => {
    await render(
      <ConfettiPiece piece={{ ...PIECE, square: true }} area={{ width: 400, height: 800 }} />,
    );

    expect(screen.getByTestId("confetti-piece")).toHaveStyle({ width: 8, height: 8 });
  });
});
