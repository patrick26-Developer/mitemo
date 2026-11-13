import {
  BILL_COLORS,
  CONFETTI_COLORS,
  COIN_COLORS,
  confettiPieces,
  confettiShape,
} from "./model.confetti";

describe("confettiPieces", () => {
  it("tire le nombre de confettis demandé, de façon reproductible", () => {
    const pieces = confettiPieces({ count: 40, seed: 7 });

    expect(pieces).toHaveLength(40);
    expect(confettiPieces({ count: 40, seed: 7 })).toEqual(pieces);
    expect(confettiPieces({ count: 40, seed: 8 })).not.toEqual(pieces);
  });

  it("mêle des billets, des pièces et des papiers, l'argent d'abord", () => {
    const pieces = confettiPieces({ count: 300, seed: 3 });
    const share = (kind: string) => pieces.filter((piece) => piece.kind === kind).length / 300;

    expect(share("bill")).toBeGreaterThan(0.3);
    expect(share("coin")).toBeGreaterThan(0.2);
    expect(share("paper")).toBeGreaterThan(0.15);
  });

  it("donne à chaque nature ses couleurs : papiers de l'app, billets et pièces", () => {
    for (const piece of confettiPieces({ count: 200, seed: 5 })) {
      const palette = { paper: CONFETTI_COLORS, bill: BILL_COLORS, coin: COIN_COLORS }[piece.kind];
      expect(palette).toContain(piece.color);
    }
  });

  it("répartit les confettis sur toute la largeur, dans le temps de la fête", () => {
    for (const piece of confettiPieces({ count: 200, seed: 3 })) {
      expect(piece.x).toBeGreaterThanOrEqual(0);
      expect(piece.x).toBeLessThan(1);
      expect(piece.delay).toBeLessThanOrEqual(600);
      expect(piece.duration).toBeGreaterThanOrEqual(1800);
      expect(piece.delay + piece.duration).toBeLessThanOrEqual(3200);
    }
  });

  it("fait tournoyer les billets plus lentement que les papiers, comme en vrai", () => {
    const pieces = confettiPieces({ count: 200, seed: 1 });
    const maxSpin = (kind: string) =>
      Math.max(
        ...pieces.filter((piece) => piece.kind === kind).map((piece) => Math.abs(piece.spin)),
      );

    expect(maxSpin("bill")).toBeLessThan(maxSpin("paper"));
    expect(pieces.some((piece) => piece.drift < 0)).toBe(true);
    expect(pieces.some((piece) => piece.drift > 0)).toBe(true);
  });
});

describe("confettiShape", () => {
  it("dessine un billet deux fois plus large que haut", () => {
    expect(confettiShape({ kind: "bill", width: 32, color: "#3FA36B", square: false })).toEqual(
      expect.objectContaining({ width: 32, height: 16, backgroundColor: "#3FA36B" }),
    );
  });

  it("dessine une pièce ronde, cerclée", () => {
    expect(confettiShape({ kind: "coin", width: 18, color: "#F5B94A", square: false })).toEqual(
      expect.objectContaining({ width: 18, height: 18, borderRadius: 9, borderWidth: 2 }),
    );
  });

  it("dessine un papier carré ou en bande", () => {
    expect(confettiShape({ kind: "paper", width: 8, color: "#083EDF", square: true })).toEqual(
      expect.objectContaining({ width: 8, height: 8 }),
    );
    expect(confettiShape({ kind: "paper", width: 8, color: "#083EDF", square: false })).toEqual(
      expect.objectContaining({ width: 8, height: 4 }),
    );
  });
});
