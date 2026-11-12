import type { TextStyle } from "react-native";

/**
 * Remise à zéro d'un `TextInput` pour qu'il s'affiche pareil sur les deux
 * plateformes : Android lui ajoute une marge native, appliquée après coup sous
 * Fabric et perdue quand son style change au focus, ainsi qu'un interligne de
 * police au-dessus et au-dessous du texte. Le champ reste donc nu : marges,
 * bordure, fond et anneau de focus vont sur la vue qui l'entoure.
 */
export const FIELD_INPUT_RESET: TextStyle = {
  padding: 0,
  borderWidth: 0,
  includeFontPadding: false,
  textAlignVertical: "center",
};
