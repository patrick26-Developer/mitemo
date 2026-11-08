import { Dimensions } from "react-native";

/** Largeur de l'écran, en points. */
const SCREEN_WIDTH = Dimensions.get("window").width;

/** Largeur d'une carte de la home : la carte suivante affleure à droite. */
export const CARD_WIDTH = SCREEN_WIDTH - 56;

/** Espacement entre deux cartes d'une liste horizontale. */
export const CARD_GAP = 12;
