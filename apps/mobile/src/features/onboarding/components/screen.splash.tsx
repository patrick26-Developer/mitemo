import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { GridBackground } from "../../../shared/components/atoms/background.grid";
import { ONBOARDING_COLORS } from "../model/model.onboarding-theme";
import { WORDMARK_DELAY_MS } from "../model/model.splash-motion";
import { SplashLogo } from "./logo.splash";
import { SplashWordmark } from "./wordmark.splash";

/** Props de l'écran de lancement. */
export interface SplashScreenProps {
  readonly visible: boolean;
}

/**
 * Écran de lancement : le logo Mitemo se dessine forme par forme sur le fond
 * bleu quadrillé de l'authentification, sa promesse apparaît, et « de
 * MITEMO » signe le bas de l'écran ; puis tout s'efface en fondu une fois
 * l'application prête.
 * @param props Visibilité de l'écran.
 * @returns L'écran de lancement, ou rien une fois l'application prête.
 */
export function SplashScreen(props: SplashScreenProps) {
  if (!props.visible) return null;

  return (
    <Animated.View testID="splash-screen" exiting={FadeOut.duration(350)} style={styles.root}>
      <GridBackground lineColor={ONBOARDING_COLORS.gridLine} />
      <SplashLogo width={150} />
      <Animated.View entering={FadeIn.delay(WORDMARK_DELAY_MS).duration(500)}>
        <Text style={styles.tagline}>Tontines et épargne, en toute confiance</Text>
      </Animated.View>
      <SplashWordmark />
    </Animated.View>
  );
}

/** Fond bleu plein écran, posé au-dessus de la navigation. */
const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    gap: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ONBOARDING_COLORS.background,
  },
  tagline: { color: ONBOARDING_COLORS.onBrandMuted, fontSize: 16, textAlign: "center" },
});
