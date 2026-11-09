import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

/** Distance entre deux points du motif, en points. */
const DOT_SPACING = 18;

/** Rayon d'un point, en points. */
const DOT_RADIUS = 1.1;

/** Couleur des points, volontairement discrète derrière les cartes. */
const DOT_COLOR = "rgba(14, 20, 35, 0.14)";

/**
 * Affiche le fond pointillé des sections de l'application.
 * @returns Le motif en points, posé derrière le contenu.
 */
export function DottedBackground() {
  return (
    <View testID="dotted-background" pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="dotted-background"
            patternUnits="userSpaceOnUse"
            width={DOT_SPACING}
            height={DOT_SPACING}
          >
            <Circle cx={DOT_RADIUS} cy={DOT_RADIUS} r={DOT_RADIUS} fill={DOT_COLOR} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#dotted-background)" />
      </Svg>
    </View>
  );
}
