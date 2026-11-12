import { StyleSheet, Text, View } from "react-native";

import type { AccentColors } from "../../model/model.accent-color";
import { NoisePattern } from "./pattern.noise";

/** Props de la face d'un bouton plein. */
export interface FilledButtonFaceProps {
  readonly label: string;
  /** Fond du bouton, repris par sa bordure, et couleur du libellé. */
  readonly colors: AccentColors;
  readonly testID?: string;
}

/**
 * Dessine la face commune à tous les boutons pleins de l'application : fond
 * texturé d'un grain discret, bordure de la même couleur que le fond, coins
 * arrondis et libellé centré. Le toucher est laissé au composant parent.
 * @param props Libellé, couleurs et identifiant de test.
 * @returns La face du bouton.
 */
export function FilledButtonFace(props: FilledButtonFaceProps) {
  const { label, colors, testID = "filled-button-face" } = props;

  return (
    <View
      testID={testID}
      className="overflow-hidden rounded-[16px]"
      style={[styles.face, { backgroundColor: colors.background, borderColor: colors.background }]}
    >
      <NoisePattern />
      <Text
        className="py-4.5 text-center text-[15px] font-semibold"
        style={{ color: colors.foreground }}
      >
        {label}
      </Text>
    </View>
  );
}

/** Épaisseur de la bordure, que Tailwind n'exprime pas avec une couleur dynamique. */
const styles = StyleSheet.create({ face: { borderWidth: 1.5 } });
