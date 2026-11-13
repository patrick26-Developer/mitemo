import { StyleSheet, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import { GridBackground } from "../../../shared/components/atoms/background.grid";
import { CornerDecor } from "../../../shared/components/atoms/decor.corner";
import { MitemoLogo } from "../../../shared/components/atoms/logo.mitemo";
import type { OnboardingSlideId } from "../model/model.onboarding-slides";
import { ONBOARDING_COLORS } from "../model/model.onboarding-theme";
import { OnboardingMascot } from "./mascot.onboarding";

/** Props du haut de la présentation. */
export interface OnboardingHeroProps {
  readonly slideId: OnboardingSlideId;
  /** Marge haute de la zone sûre, en points. */
  readonly topInset: number;
}

/**
 * Haut bleu quadrillé de la présentation : le logo, puis la mascotte de la page
 * courante dans un halo, qui réapparaît à chaque changement de page.
 * @param props Page courante et zone sûre.
 * @returns Le haut de l'écran.
 */
export function OnboardingHero(props: OnboardingHeroProps) {
  return (
    <View style={[styles.root, { paddingTop: props.topInset + 24 }]}>
      <GridBackground lineColor={ONBOARDING_COLORS.gridLine} />
      <CornerDecor side="left" />
      <CornerDecor side="right" />
      <MitemoLogo width={72} />
      <Animated.View key={props.slideId} entering={ZoomIn.duration(450)} style={styles.halo}>
        <OnboardingMascot slideId={props.slideId} />
      </Animated.View>
    </View>
  );
}

/** Fond bleu et halo de la mascotte. */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    gap: 48,
    backgroundColor: ONBOARDING_COLORS.background,
  },
  halo: {
    width: 250,
    height: 250,
    borderRadius: 125,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ONBOARDING_COLORS.halo,
  },
});
