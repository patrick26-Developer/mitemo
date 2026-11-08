import { Dimensions } from "react-native";

/** Largeur de l'écran, en points. */
const SCREEN_WIDTH = Dimensions.get("window").width;

/** Largeur d'une carte de liste horizontale : la carte suivante affleure à droite. */
export const CARD_WIDTH = SCREEN_WIDTH - 56;

/** Largeur utile d'une carte, une fois son rembourrage interne déduit. */
export const CARD_INNER_WIDTH = CARD_WIDTH - 8;

/** Espacement entre deux cartes d'une liste horizontale. */
export const CARD_GAP = 12;
