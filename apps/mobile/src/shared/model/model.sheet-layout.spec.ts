import {
  SHEET_BOTTOM_PADDING,
  SHEET_BOTTOM_RADIUS,
  SHEET_MARGIN,
  SHEET_MAX_HEIGHT_RATIO,
  SHEET_MIN_HEIGHT_RATIO,
  computeSheetLayout,
  sheetContentPaddingBottom,
} from "./model.sheet-layout";

describe("computeSheetLayout", () => {
  it("pose la carte à plat contre le bas de l'écran sur Android, flottante sur iOS", () => {
    const base = { keyboardHeight: 0, bottomInset: 12, screenHeight: 800 };
    const android = computeSheetLayout({ ...base, platform: "android" });
    const ios = computeSheetLayout({ ...base, platform: "ios" });

    expect(android).toMatchObject({ marginBottom: 0, bottomRadius: 0 });
    expect(ios).toMatchObject({ marginBottom: SHEET_MARGIN, bottomRadius: SHEET_BOTTOM_RADIUS });
  });

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
      bottomRadius: SHEET_BOTTOM_RADIUS,
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
    expect(layout.marginBottom).toBe(0);
  });

  it("ajoute la barre système à la hauteur du clavier sur Android", () => {
    const layout = computeSheetLayout({
      platform: "android",
      keyboardHeight: 300,
      bottomInset: 12,
      screenHeight: 800,
    });

    expect(layout.paddingBottom).toBe(300 + 12 + SHEET_BOTTOM_PADDING);
    expect(layout.marginBottom).toBe(0);
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

  describe("sheetContentPaddingBottom", () => {
    it("garde la marge basse sur Android, où la carte posée à plat n'a ni arrondi ni marge", () => {
      const android = computeSheetLayout({
        platform: "android",
        keyboardHeight: 0,
        bottomInset: 16,
        screenHeight: 800,
      });

      expect(sheetContentPaddingBottom(android)).toBe(16 + SHEET_BOTTOM_PADDING);
    });

    it("colle au contenu sur iOS, où l'arrondi et la marge de la carte flottante font l'espace", () => {
      const ios = computeSheetLayout({
        platform: "ios",
        keyboardHeight: 0,
        bottomInset: 34,
        screenHeight: 844,
      });

      expect(sheetContentPaddingBottom(ios)).toBe(34);
    });
  });
});
