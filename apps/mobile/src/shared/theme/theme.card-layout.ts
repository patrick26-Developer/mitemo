import { Dimensions } from "react-native";

/** Largeur de l'écran, en points. */
const SCREEN_WIDTH = Dimensions.get("window").width;

/** Largeur d'une carte de la home : la carte suivante affleure à droite. */
export const CARD_WIDTH = SCREEN_WIDTH - 56;

/** Largeur d'une carte pleine largeur, entre les marges de 16 points des listes. */
export const FULL_CARD_WIDTH = SCREEN_WIDTH - 32;

/** Rembourrage horizontal de la carte, de chaque côté, en points. */
export const CARD_PADDING = 8;

/** Épaisseur de la bordure extérieure de la carte, en points. */
export const CARD_BORDER = 1;

/** Épaisseur de la bordure du bandeau de carte, en points. */
export const CARD_HEADER_BORDER = 1;

/** Espacement entre deux cartes d'une liste horizontale. */
export const CARD_GAP = 12;

/**
 * Calcule la largeur utile du bandeau d'une carte.
 * @param cardWidth Largeur totale de la carte, en points.
 * @returns La largeur du bandeau, rembourrage et bordures déduits.
 */
export function computeHeaderWidth(cardWidth: number): number {
  return cardWidth - 2 * (CARD_PADDING + CARD_BORDER + CARD_HEADER_BORDER);
}
