import { ArrowRight } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { PressableScale } from "../../../shared/components/atoms/scale.pressable";
import { AUTH_COLORS } from "../model/model.auth-theme";

/** Props de l'action principale d'un écran d'authentification. */
export interface AuthPrimaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
}

/**
 * Affiche le bouton bleu principal, avec sa flèche et son état désactivé.
 * @param props Libellé, action et état désactivé.
 * @returns Le bouton d'action.
 */
export function AuthPrimaryButton(props: AuthPrimaryButtonProps) {
  const { label, onPress, disabled = false } = props;

  return (
    <PressableScale accessibilityLabel={label} onPress={onPress} disabled={disabled}>
      <View style={[styles.button, disabled && styles.disabled]}>
        <Text style={styles.label}>{label}</Text>
        <ArrowRight size={22} color={AUTH_COLORS.sheet} />
      </View>
    </PressableScale>
  );
}

/** Styles de la pastille bleue et de son ombre. */
const styles = StyleSheet.create({
  button: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 29,
    backgroundColor: AUTH_COLORS.button,
    shadowColor: AUTH_COLORS.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  disabled: { opacity: 0.55 },
  label: { color: AUTH_COLORS.sheet, fontSize: 19, fontWeight: "600" },
});
