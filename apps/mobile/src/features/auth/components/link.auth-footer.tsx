import { StyleSheet, Text, View } from "react-native";

import { PressableScale } from "../../../shared/components/atoms/scale.pressable";
import { AUTH_COLORS } from "../model/model.auth-theme";

/** Props de l'alternative affichée sous un formulaire. */
export interface AuthFooterLinkProps {
  /** Phrase d'introduction, par exemple « Déjà un compte ? ». */
  readonly prompt: string;
  /** Libellé de l'action. */
  readonly label: string;
  readonly onPress: () => void;
}

/**
 * Affiche une phrase suivie d'un lien vers l'autre parcours d'authentification.
 * @param props Phrase, libellé et action.
 * @returns La ligne de lien secondaire.
 */
export function AuthFooterLink(props: AuthFooterLinkProps) {
  const { prompt, label, onPress } = props;

  return (
    <View style={styles.row}>
      <Text style={styles.prompt}>{prompt} </Text>
      <PressableScale accessibilityLabel={label} onPress={onPress} className="rounded-md">
        <Text style={styles.link}>{label}</Text>
      </PressableScale>
    </View>
  );
}

/** Styles de la ligne de lien. */
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
  },
  prompt: { fontSize: 16, color: AUTH_COLORS.muted },
  link: { fontSize: 16, fontWeight: "600", color: AUTH_COLORS.ink },
});
