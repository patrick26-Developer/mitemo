import type { ViewStyle } from "react-native";

import type { SheetLayout } from "../model/model.sheet-layout";
import { SHEET_MARGIN } from "../model/model.sheet-layout";
import { PALETTE } from "./theme.palette";

/** Rayon des coins hauts d'une carte ancrée en bas de l'écran, en points. */
const SHEET_TOP_RADIUS = 24;

/** Rembourrage horizontal d'une carte ancrée en bas de l'écran, en points. */
const SHEET_HORIZONTAL_PADDING = 20;

/** Rembourrage au-dessus du contenu d'une carte ancrée en bas de l'écran. */
const SHEET_TOP_PADDING = 14;

/** Épaisseur du filet supérieur d'une carte ancrée en bas de l'écran. */
const SHEET_TOP_BORDER = 1;

/**
 * Forme de la poignée de préhension, commune à la carte d'authentification et
 * aux feuilles. Chaque carte ajoute sa position et sa couleur.
 */
export const SHEET_HANDLE_SHAPE: ViewStyle = {
  width: 42,
  height: 3,
  borderRadius: 2,
};

/**
 * Calcule la forme et les dimensions communes à la carte d'authentification et
 * aux feuilles : coins, filet supérieur, rembourrages, bornes de hauteur et
 * marges. La couleur du filet reste à la charge de chaque carte.
 * @param layout Dimensions et marges calculées pour la carte.
 * @returns Le style de la surface de la carte.
 */
export function computeSheetCardStyle(layout: SheetLayout): ViewStyle {
  return {
    flexShrink: 1,
    backgroundColor: PALETTE.white,
    borderTopLeftRadius: SHEET_TOP_RADIUS,
    borderTopRightRadius: SHEET_TOP_RADIUS,
    borderBottomLeftRadius: layout.bottomRadius,
    borderBottomRightRadius: layout.bottomRadius,
    borderTopWidth: SHEET_TOP_BORDER,
    paddingHorizontal: SHEET_HORIZONTAL_PADDING,
    paddingTop: SHEET_TOP_PADDING,
    minHeight: layout.minHeight,
    maxHeight: layout.maxHeight,
    paddingBottom: layout.paddingBottom,
    marginHorizontal: SHEET_MARGIN,
    marginBottom: layout.marginBottom,
  };
}
