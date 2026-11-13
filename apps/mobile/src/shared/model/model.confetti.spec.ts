import { CONFETTI_COLORS, confettiPieces } from "./model.confetti";

describe("confettiPieces", () => {
  it("tire le nombre de confettis demandé, de façon reproductible", () => {
    const pieces = confettiPieces({ count: 40, seed: 7 });

    expect(pieces).toHaveLength(40);
    expect(confettiPieces({ count: 40, seed: 7 })).toEqual(pieces);
    expect(confettiPieces({ count: 40, seed: 8 })).not.toEqual(pieces);
  });

  it("répartit les confettis sur toute la largeur, aux couleurs de l'app", () => {
    for (const piece of confettiPieces({ count: 200, seed: 3 })) {
      expect(piece.x).toBeGreaterThanOrEqual(0);
      expect(piece.x).toBeLessThan(1);
      expect(CONFETTI_COLORS).toContain(piece.color);
      expect(piece.delay).toBeLessThanOrEqual(400);
      expect(piece.duration).toBeGreaterThanOrEqual(1800);
      expect(piece.duration).toBeLessThanOrEqual(2800);
    }
  });

  it("varie la forme, la dérive et la rotation de chaque confetti", () => {
    const pieces = confettiPieces({ count: 40, seed: 1 });

    expect(new Set(pieces.map((piece) => piece.width)).size).toBeGreaterThan(1);
    expect(pieces.some((piece) => piece.drift < 0)).toBe(true);
    expect(pieces.some((piece) => piece.drift > 0)).toBe(true);
    expect(pieces.every((piece) => Math.abs(piece.spin) >= 180)).toBe(true);
  });
});
