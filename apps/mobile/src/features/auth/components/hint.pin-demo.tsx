import { StyleSheet, Text } from "react-native";

import { DEMO_PIN } from "../model/model.auth-form";
import { AUTH_COLORS } from "../model/model.auth-theme";

/**
 * Rappelle le code de démonstration tant que la vérification vient de l'API.
 * @returns Le texte d'aide sous le clavier.
 */
export function PinDemoHint() {
  return (
    <Text testID="demo-pin" style={styles.hint}>
      {`Code de démonstration : ${DEMO_PIN}`}
    </Text>
  );
}

/** Style discret de l'aide, sous le clavier. */
const styles = StyleSheet.create({
  hint: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 13,
    color: AUTH_COLORS.muted,
  },
});
