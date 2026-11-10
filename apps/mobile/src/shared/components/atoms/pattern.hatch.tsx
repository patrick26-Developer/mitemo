import type { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from "react-native-svg";

/**
 * Distance horizontale entre deux hachures, en points.
 */
const HATCH_SPACING = 3.62;

/**
 * Épaisseur d'une hachure ; au-delà, les traits deviennent trop marqués.
 */
const HATCH_STROKE = 0.18;

/**
 * Props du motif hachuré.
 */
export interface HatchPatternProps {
  /** Largeur du motif ; pleine largeur du parent par défaut. */
  readonly width?: NonNullable<DimensionValue>;
  /** Hauteur du motif, en points. */
  readonly height?: NonNullable<DimensionValue>;
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * Affiche le motif de hachures diagonales qui sépare les zones de l'accueil.
 * @param props Largeur, hauteur et style du motif.
 * @returns Le motif hachuré.
 */
export function HatchPattern(props: HatchPatternProps) {
  const { width, height = 12, style } = props;

  return (
    <Svg width={width ?? "100%"} height={height} style={style}>
      <Defs>
        <HatchTile />
      </Defs>
      <Rect width="100%" height="100%" fill="url(#hatch)" />
    </Svg>
  );
}

/**
 * Décrit le motif répété d'une hachure, avec ses deux moitiés de raccord.
 * @returns La tuile de hachures.
 */
function HatchTile() {
  const half = HATCH_SPACING / 2;

  return (
    <Pattern id="hatch" patternUnits="userSpaceOnUse" width={HATCH_SPACING} height={HATCH_SPACING}>
      <Line
        x1={0}
        y1={HATCH_SPACING}
        x2={HATCH_SPACING}
        y2={0}
        stroke="#000"
        strokeWidth={HATCH_STROKE}
      />
      <Line x1={-half} y1={half} x2={half} y2={-half} stroke="#000" strokeWidth={HATCH_STROKE} />
      <Line
        x1={half}
        y1={HATCH_SPACING + half}
        x2={HATCH_SPACING + half}
        y2={half}
        stroke="#000"
        strokeWidth={HATCH_STROKE}
      />
    </Pattern>
  );
}
