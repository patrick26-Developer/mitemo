import {
  AUTH_SHEET_BOTTOM_PADDING,
  AUTH_SHEET_MARGIN_BOTTOM,
  AUTH_SHEET_MAX_HEIGHT_RATIO,
  computeAuthSheetLayout,
} from "./auth-sheet-layout";

describe("computeAuthSheetLayout", () => {
  it("réserve la hauteur du clavier sous le contenu sur iOS", () => {
    const layout = computeAuthSheetLayout({
      platform: "ios",
      keyboardHeight: 320,
      bottomInset: 34,
      screenHeight: 844,
    });

    expect(layout).toEqual({
      maxHeight: 844 * AUTH_SHEET_MAX_HEIGHT_RATIO,
      paddingBottom: 320 + AUTH_SHEET_BOTTOM_PADDING,
      marginBottom: AUTH_SHEET_MARGIN_BOTTOM,
    });
  });

  it("garde la carte ancrée quand le clavier est fermé sur Android", () => {
    const layout = computeAuthSheetLayout({
      platform: "android",
      keyboardHeight: 0,
      bottomInset: 12,
      screenHeight: 800,
    });

    expect(layout.paddingBottom).toBe(12 + AUTH_SHEET_BOTTOM_PADDING);
    expect(layout.marginBottom).toBe(AUTH_SHEET_MARGIN_BOTTOM);
  });

  it("ajoute la barre système à la hauteur du clavier sur Android", () => {
    const layout = computeAuthSheetLayout({
      platform: "android",
      keyboardHeight: 300,
      bottomInset: 12,
      screenHeight: 800,
    });

    expect(layout.paddingBottom).toBe(300 + 12 + AUTH_SHEET_BOTTOM_PADDING);
    expect(layout.marginBottom).toBe(AUTH_SHEET_MARGIN_BOTTOM);
  });

  it("ne déplace jamais la carte, clavier ouvert ou fermé", () => {
    const closed = computeAuthSheetLayout({
      platform: "ios",
      keyboardHeight: 0,
      bottomInset: 34,
      screenHeight: 844,
    });
    const opened = computeAuthSheetLayout({
      platform: "ios",
      keyboardHeight: 320,
      bottomInset: 34,
      screenHeight: 844,
    });

    expect(opened.marginBottom).toBe(closed.marginBottom);
    expect(opened.maxHeight).toBe(closed.maxHeight);
  });

  it("limite la carte à la part maximale de l'écran", () => {
    const layout = computeAuthSheetLayout({
      platform: "android",
      keyboardHeight: 0,
      bottomInset: 0,
      screenHeight: 640,
    });

    expect(layout.maxHeight).toBe(640 * AUTH_SHEET_MAX_HEIGHT_RATIO);
  });
});
