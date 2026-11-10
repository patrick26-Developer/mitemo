import {
  SHEET_BOTTOM_PADDING,
  SHEET_MARGIN,
  SHEET_MAX_HEIGHT_RATIO,
  SHEET_MIN_HEIGHT_RATIO,
  computeSheetLayout,
} from "./model.sheet-layout";

describe("computeSheetLayout", () => {
  it("réserve la hauteur du clavier sous le contenu sur iOS", () => {
    const layout = computeSheetLayout({
      platform: "ios",
      keyboardHeight: 320,
      bottomInset: 34,
      screenHeight: 844,
    });

    expect(layout).toEqual({
      minHeight: 844 * SHEET_MIN_HEIGHT_RATIO,
      maxHeight: 844 * SHEET_MAX_HEIGHT_RATIO,
      paddingBottom: 320 + SHEET_BOTTOM_PADDING,
      marginBottom: SHEET_MARGIN,
    });
  });

  it("garde la carte ancrée quand le clavier est fermé sur Android", () => {
    const layout = computeSheetLayout({
      platform: "android",
      keyboardHeight: 0,
      bottomInset: 12,
      screenHeight: 800,
    });

    expect(layout.paddingBottom).toBe(12 + SHEET_BOTTOM_PADDING);
    expect(layout.marginBottom).toBe(SHEET_MARGIN);
  });

  it("ajoute la barre système à la hauteur du clavier sur Android", () => {
    const layout = computeSheetLayout({
      platform: "android",
      keyboardHeight: 300,
      bottomInset: 12,
      screenHeight: 800,
    });

    expect(layout.paddingBottom).toBe(300 + 12 + SHEET_BOTTOM_PADDING);
    expect(layout.marginBottom).toBe(SHEET_MARGIN);
  });

  it("ne déplace jamais la carte, clavier ouvert ou fermé", () => {
    const closed = computeSheetLayout({
      platform: "ios",
      keyboardHeight: 0,
      bottomInset: 34,
      screenHeight: 844,
    });
    const opened = computeSheetLayout({
      platform: "ios",
      keyboardHeight: 320,
      bottomInset: 34,
      screenHeight: 844,
    });

    expect(opened.marginBottom).toBe(closed.marginBottom);
    expect(opened.maxHeight).toBe(closed.maxHeight);
  });

  it("borne la carte entre une hauteur minimale et une hauteur maximale", () => {
    const layout = computeSheetLayout({
      platform: "android",
      keyboardHeight: 0,
      bottomInset: 0,
      screenHeight: 640,
    });

    expect(layout.minHeight).toBe(640 * SHEET_MIN_HEIGHT_RATIO);
    expect(layout.maxHeight).toBe(640 * SHEET_MAX_HEIGHT_RATIO);
  });
});
