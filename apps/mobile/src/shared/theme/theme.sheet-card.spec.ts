import type { SheetLayout } from "../model/model.sheet-layout";
import { SHEET_MARGIN } from "../model/model.sheet-layout";
import { SHEET_HANDLE_SHAPE, computeSheetCardStyle } from "./theme.sheet-card";

const LAYOUT: SheetLayout = {
  minHeight: 211,
  maxHeight: 743,
  paddingBottom: 54,
  marginBottom: SHEET_MARGIN,
  bottomRadius: 48,
};

describe("computeSheetCardStyle", () => {
  it("reprend la forme commune des cartes ancrées en bas", () => {
    expect(computeSheetCardStyle(LAYOUT)).toMatchObject({
      flexShrink: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderBottomLeftRadius: 48,
      borderBottomRightRadius: 48,
      borderTopWidth: 1,
      paddingHorizontal: 20,
      paddingTop: 14,
      marginHorizontal: SHEET_MARGIN,
    });
  });

  it("applique les dimensions calculées pour la carte", () => {
    expect(computeSheetCardStyle(LAYOUT)).toMatchObject({
      minHeight: 211,
      maxHeight: 743,
      paddingBottom: 54,
      marginBottom: SHEET_MARGIN,
    });
  });

  it("partage la poignée entre toutes les cartes", () => {
    expect(SHEET_HANDLE_SHAPE).toEqual({ width: 42, height: 3, borderRadius: 2 });
  });

  it("reprend l'arrondi bas calculé, nul sur Android", () => {
    expect(computeSheetCardStyle({ ...LAYOUT, bottomRadius: 0, marginBottom: 0 })).toMatchObject({
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      marginBottom: 0,
    });
  });
});
