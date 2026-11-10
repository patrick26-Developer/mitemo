import { StyleSheet } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from "react-native-svg";

/** Espacement horizontal entre deux traits de la bande, en points. */
const LINE_SPACING = 2.6;

/** Props de la bande décorative. */
export interface BarcodeStripProps {
  /** Couleur des traits verticaux. */
  readonly color: string;
  /** Hauteur de la bande, en points. */
  readonly height?: number;
}

/**
 * Affiche une bande décorative de traits verticaux, rappel d'un billet.
 * @param props Couleur et hauteur de la bande.
 * @returns La bande de traits.
 */
export function BarcodeStrip(props: BarcodeStripProps) {
  const { color, height = 13 } = props;

  return (
    <Svg width="100%" height={height} style={styles.strip}>
      <Defs>
        <Pattern id="vlines" patternUnits="userSpaceOnUse" width={LINE_SPACING} height={height}>
          <Line
            x1={LINE_SPACING / 2}
            y1={0}
            x2={LINE_SPACING / 2}
            y2={height}
            stroke={color}
            strokeWidth={1}
          />
        </Pattern>
      </Defs>
      <Rect width="100%" height={height} fill="url(#vlines)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  strip: { opacity: 0.9 },
});
