import type { TextStyle } from "react-native";

/**
 * Remise à zéro d'un `TextInput` pour qu'il s'affiche pareil sur les deux
 * plateformes : Android ajoute une marge verticale native et un interligne de
 * police au-dessus et au-dessous du texte, ce qui décale et rogne la saisie
 * dans un champ de hauteur fixe.
 */
export const FIELD_INPUT_RESET: TextStyle = {
  paddingVertical: 0,
  includeFontPadding: false,
  textAlignVertical: "center",
};
