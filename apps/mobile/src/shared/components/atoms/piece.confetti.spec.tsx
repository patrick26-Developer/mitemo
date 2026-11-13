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
  kind: "paper",
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

  it("dessine un billet avec sa marque au centre", async () => {
    await render(
      <ConfettiPiece
        piece={{ ...PIECE, kind: "bill", width: 32, color: "#3FA36B" }}
        area={{ width: 400, height: 800 }}
      />,
    );

    expect(screen.getByTestId("confetti-piece")).toHaveStyle({ width: 32, height: 16 });
    expect(screen.getByTestId("confetti-bill-mark")).toBeOnTheScreen();
  });

  it("dessine une pièce avec son anneau", async () => {
    await render(
      <ConfettiPiece
        piece={{ ...PIECE, kind: "coin", width: 18, color: "#F5B94A" }}
        area={{ width: 400, height: 800 }}
      />,
    );

    expect(screen.getByTestId("confetti-piece")).toHaveStyle({ width: 18, height: 18 });
    expect(screen.getByTestId("confetti-coin-mark")).toBeOnTheScreen();
  });
});
