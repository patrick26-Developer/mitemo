import { StyleSheet, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import { AUTH_COLORS } from "../model/auth-theme";

/** Caractère affiché à la place du chiffre saisi. */
const MASK = "•";

/** Props d'une case du code PIN. */
export interface PinBoxProps {
  /** Position de la case, de 0 à 3. */
  readonly index: number;
  /** Chiffre saisi dans cette case, `undefined` tant qu'elle est vide. */
  readonly value?: string | undefined;
  /** Vrai quand la saisie attend le chiffre de cette case. */
  readonly active: boolean;
}

/**
 * Affiche une case du PIN, son masque et la bordure active.
 * @param props Position, chiffre et état actif.
 * @returns La case du code PIN.
 */
export function PinBox(props: PinBoxProps) {
  const { index, value, active } = props;

  return (
    <View testID={`pin-box-${index}`} style={[styles.box, active && styles.active]}>
      {value === undefined ? null : (
        <Animated.Text key={value} entering={ZoomIn.duration(150)} style={styles.value}>
          {MASK}
        </Animated.Text>
      )}
    </View>
  );
}

/** Styles de la case, repris de la maquette. */
const styles = StyleSheet.create({
  box: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    backgroundColor: AUTH_COLORS.field,
  },
  active: { borderWidth: 2, borderColor: AUTH_COLORS.button },
  value: { fontSize: 22, color: AUTH_COLORS.body },
});
