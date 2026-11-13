import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ONBOARDING_COLORS } from "../model/model.onboarding-theme";
import { WORDMARK_DELAY_MS } from "../model/model.splash-motion";

/**
 * Signature du lancement en bas de l'écran, « de MITEMO », à la manière des
 * grandes marques : discrète, au-dessus de la barre système.
 * @returns La signature animée.
 */
export function SplashWordmark() {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeIn.delay(WORDMARK_DELAY_MS).duration(500)}
      style={[styles.root, { bottom: insets.bottom + 28 }]}
    >
      <Text style={styles.from}>de</Text>
      <Text style={styles.name}>MITEMO</Text>
    </Animated.View>
  );
}

/** Signature centrée, collée au bas de l'écran. */
const styles = StyleSheet.create({
  root: { position: "absolute", left: 0, right: 0, alignItems: "center", gap: 2 },
  from: { color: ONBOARDING_COLORS.onBrandMuted, fontSize: 13 },
  name: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", letterSpacing: 4 },
});
