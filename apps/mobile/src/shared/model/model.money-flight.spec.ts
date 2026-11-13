import { FLIGHT_ARC, flightPoint } from "./model.money-flight";

/** Trajet de test : du dock, en bas, au montant, en haut à gauche. */
const PATH = { from: { x: 200, y: 780 }, to: { x: 120, y: 260 } };

describe("flightPoint", () => {
  it("part du bouton et arrive sur le montant", () => {
    expect(flightPoint(PATH, 0)).toEqual(PATH.from);
    expect(flightPoint(PATH, 1)).toEqual(PATH.to);
  });

  it("passe au-dessus de la ligne droite, en arc", () => {
    const middle = flightPoint(PATH, 0.5);
    const straightY = (PATH.from.y + PATH.to.y) / 2;

    expect(middle.y).toBeLessThan(straightY);
    expect(middle.x).toBeCloseTo(160);
    expect(FLIGHT_ARC).toBeGreaterThan(0);
  });
});
