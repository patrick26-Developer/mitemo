import {
  SHEET_DISMISS_DISTANCE,
  SHEET_DISMISS_VELOCITY,
  shouldDismissSheet,
} from "./model.sheet-gesture";

describe("shouldDismissSheet", () => {
  it("garde la feuille ouverte pour un petit glissement lent", () => {
    expect(shouldDismissSheet(40, 0.2)).toBe(false);
  });

  it("ferme la feuille au-delà de la distance de fermeture", () => {
    expect(shouldDismissSheet(SHEET_DISMISS_DISTANCE + 1, 0)).toBe(true);
  });

  it("ferme la feuille sur un geste rapide vers le bas", () => {
    expect(shouldDismissSheet(20, SHEET_DISMISS_VELOCITY + 0.1)).toBe(true);
  });

  it("ne ferme pas la feuille sur un geste rapide vers le haut", () => {
    expect(shouldDismissSheet(-80, -1)).toBe(false);
  });
});
