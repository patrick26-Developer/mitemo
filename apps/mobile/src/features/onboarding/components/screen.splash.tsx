import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";

import { GridBackground } from "../../../shared/components/atoms/background.grid";
import { MitemoLogo } from "../../../shared/components/atoms/logo.mitemo";
import { ONBOARDING_COLORS } from "../model/model.onboarding-theme";

/** Props de l'écran de lancement. */
export interface SplashScreenProps {
  readonly visible: boolean;
}

/**
 * Écran de lancement : le logo Mitemo apparaît sur le fond bleu quadrillé de
 * l'authentification, avec sa promesse, puis s'efface en fondu une fois
 * l'application prête.
 * @param props Visibilité de l'écran.
 * @returns L'écran de lancement, ou rien une fois l'application prête.
 */
export function SplashScreen(props: SplashScreenProps) {
  if (!props.visible) return null;

  return (
    <Animated.View testID="splash-screen" exiting={FadeOut.duration(350)} style={styles.root}>
      <GridBackground lineColor={ONBOARDING_COLORS.gridLine} />
      <Animated.View entering={ZoomIn.duration(600)}>
        <MitemoLogo width={150} />
      </Animated.View>
      <Animated.View entering={FadeIn.delay(300).duration(500)}>
        <Text style={styles.tagline}>Tontines et épargne, en toute confiance</Text>
      </Animated.View>
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
