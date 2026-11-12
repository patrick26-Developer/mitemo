/** Marge latérale et basse d'une carte ancrée en bas de l'écran, en points. */
export const SHEET_MARGIN = 8;

/** Espace ajouté sous le contenu d'une carte, en points. */
export const SHEET_BOTTOM_PADDING = 20;

/** Arrondi bas de la carte flottante d'iOS, en points ; nul sur Android. */
export const SHEET_BOTTOM_RADIUS = 48;

/** Part de l'écran qu'une carte peut occuper au maximum. */
export const SHEET_MAX_HEIGHT_RATIO = 0.88;

/**
 * Part minimale de l'écran qu'une carte occupe, pour qu'une feuille presque
 * vide ne ressemble pas à un bandeau.
 */
export const SHEET_MIN_HEIGHT_RATIO = 0.25;

/** Plateforme dont dépend la mesure du clavier. */
export type SheetPlatform = "android" | "ios";

/** Entrées du calcul d'une carte ancrée en bas de l'écran. */
export interface SheetLayoutInput {
  /** Plateforme courante. */
  readonly platform: SheetPlatform;
  /** Hauteur du clavier, nulle quand il est fermé. */
  readonly keyboardHeight: number;
  /** Marge basse de la zone sûre, en points. */
  readonly bottomInset: number;
  /** Hauteur de l'écran physique, en points. */
  readonly screenHeight: number;
}

/** Dimensions et marges d'une carte ancrée en bas de l'écran. */
export interface SheetLayout {
  /** Hauteur minimale de la carte, en points. */
  readonly minHeight: number;
  /** Hauteur maximale de la carte, en points. */
  readonly maxHeight: number;
  /** Espace sous le contenu, clavier et barre système compris, en points. */
  readonly paddingBottom: number;
  /** Marge sous la carte, constante : la carte ne se déplace pas. Nulle sur Android. */
  readonly marginBottom: number;
  /** Arrondi des coins bas : la carte flotte sur iOS, elle est posée à plat sur Android. */
  readonly bottomRadius: number;
}

/**
 * Calcule les bornes de hauteur et la place réservée au clavier sous le contenu
 * d'une carte ancrée en bas de l'écran.
 *
 * Entre sa hauteur minimale et sa hauteur maximale, la carte prend la hauteur
 * de son contenu. Elle garde une marge basse constante et grandit vers le haut
 * quand le clavier apparaît.
 *
 * Android applique l'affichage bord à bord : le clavier recouvre la fenêtre
 * sans la réduire, et React Native mesure sa hauteur sans la barre de
 * navigation. iOS mesure la hauteur du clavier depuis le bas de l'écran, barre
 * système comprise.
 * @param input Plateforme, clavier, marge basse et hauteur d'écran.
 * @returns Les dimensions et marges de la carte.
 */
export function computeSheetLayout(input: SheetLayoutInput): SheetLayout {
  const { platform, keyboardHeight, bottomInset, screenHeight } = input;
  const keyboardVisible = keyboardHeight > 0;
  const floating = platform === "ios";
  const keyboardSpace = keyboardVisible
    ? keyboardHeight + (platform === "android" ? bottomInset : 0)
    : bottomInset;

  return {
    minHeight: screenHeight * SHEET_MIN_HEIGHT_RATIO,
    maxHeight: screenHeight * SHEET_MAX_HEIGHT_RATIO,
    paddingBottom: keyboardSpace + SHEET_BOTTOM_PADDING,
    marginBottom: floating ? SHEET_MARGIN : 0,
    bottomRadius: floating ? SHEET_BOTTOM_RADIUS : 0,
  };
}
