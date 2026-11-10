import { StyleSheet, View } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from "react-native-svg";

/** Distance entre deux lignes de la grille, en points. */
const GRID_SPACING = 16;

/** Couleur par défaut des lignes, discrète sur un fond sombre. */
const DEFAULT_LINE_COLOR = "rgba(255, 255, 255, 0.09)";

/** Props du fond quadrillé. */
export interface GridBackgroundProps {
  /** Couleur des lignes ; le fond reste transparent. */
  readonly lineColor?: string;
  readonly testID?: string;
}

/**
 * Affiche un quadrillage discret derrière un contenu, comme le voile d'une
 * feuille modale ou le fond d'un écran d'authentification.
 * @param props Couleur des lignes et identifiant de test.
 * @returns Le motif quadrillé, posé derrière le contenu.
 */
export function GridBackground(props: GridBackgroundProps) {
  const { lineColor = DEFAULT_LINE_COLOR, testID = "grid-background" } = props;

  return (
    <View testID={testID} pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="grid-background"
            patternUnits="userSpaceOnUse"
            width={GRID_SPACING}
            height={GRID_SPACING}
          >
            <Line x1={0} y1={0} x2={GRID_SPACING} y2={0} stroke={lineColor} strokeWidth={1} />
            <Line x1={0} y1={0} x2={0} y2={GRID_SPACING} stroke={lineColor} strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grid-background)" />
      </Svg>
    </View>
  );
}
