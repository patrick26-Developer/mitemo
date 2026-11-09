/** Marge basse de la carte d'authentification, en points. */
export const AUTH_SHEET_MARGIN_BOTTOM = 8;

/** Espace ajouté sous le contenu de la carte, en points. */
export const AUTH_SHEET_BOTTOM_PADDING = 20;

/** Part de l'écran que la carte peut occuper au maximum. */
export const AUTH_SHEET_MAX_HEIGHT_RATIO = 0.88;

/** Plateforme dont dépend la mesure du clavier. */
export type AuthSheetPlatform = "android" | "ios";

/** Entrées du calcul de la carte d'authentification. */
export interface AuthSheetLayoutInput {
  /** Plateforme courante. */
  readonly platform: AuthSheetPlatform;
  /** Hauteur du clavier, nulle quand il est fermé. */
  readonly keyboardHeight: number;
  /** Marge basse de la zone sûre, en points. */
  readonly bottomInset: number;
  /** Hauteur de l'écran physique, en points. */
  readonly screenHeight: number;
}

/** Dimensions et marges de la carte d'authentification. */
export interface AuthSheetLayout {
  /** Hauteur maximale de la carte, en points. */
  readonly maxHeight: number;
  /** Espace sous le contenu, clavier et barre système compris, en points. */
  readonly paddingBottom: number;
  /** Marge sous la carte, constante : la carte ne se déplace pas. */
  readonly marginBottom: number;
}

/**
 * Calcule la place réservée au clavier dans la carte d'authentification.
 *
 * La carte reste ancrée en bas de l'écran : on lui ajoute sous son contenu la
 * hauteur du clavier, ce qui la fait grandir vers le haut. Android applique
 * l'affichage bord à bord : le clavier recouvre la fenêtre sans la réduire, et
 * React Native mesure sa hauteur sans la barre de navigation. iOS mesure la
 * hauteur du clavier depuis le bas de l'écran, barre système comprise.
 * @param input Plateforme, clavier, marge basse et hauteur d'écran.
 * @returns Les dimensions et marges de la carte.
 */
export function computeAuthSheetLayout(input: AuthSheetLayoutInput): AuthSheetLayout {
  const { platform, keyboardHeight, bottomInset, screenHeight } = input;
  const keyboardVisible = keyboardHeight > 0;
  const keyboardSpace = keyboardVisible
    ? keyboardHeight + (platform === "android" ? bottomInset : 0)
    : bottomInset;

  return {
    maxHeight: screenHeight * AUTH_SHEET_MAX_HEIGHT_RATIO,
    paddingBottom: keyboardSpace + AUTH_SHEET_BOTTOM_PADDING,
    marginBottom: AUTH_SHEET_MARGIN_BOTTOM,
  };
}
