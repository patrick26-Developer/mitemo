import type { LucideIcon } from "lucide-react-native";
import { HandCoins, Smartphone, UsersRound } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import { GridBackground } from "../../../shared/components/atoms/background.grid";
import { CornerDecor } from "../../../shared/components/atoms/decor.corner";
import { MitemoLogo } from "../../../shared/components/atoms/logo.mitemo";
import { PALETTE } from "../../../shared/theme/theme.palette";
import type { OnboardingSlideId } from "../model/model.onboarding-slides";
import { ONBOARDING_COLORS } from "../model/model.onboarding-theme";

/** Icône de chaque page de la présentation. */
const SLIDE_ICONS: Readonly<Record<OnboardingSlideId, LucideIcon>> = {
  tontines: UsersRound,
  payment: Smartphone,
  savings: HandCoins,
};

/** Props du haut de la présentation. */
export interface OnboardingHeroProps {
  readonly slideId: OnboardingSlideId;
  /** Marge haute de la zone sûre, en points. */
  readonly topInset: number;
}

/**
 * Haut bleu quadrillé de la présentation : le logo, puis l'icône de la page
 * courante dans un halo, qui réapparaît à chaque changement de page.
 * @param props Page courante et zone sûre.
 * @returns Le haut de l'écran.
 */
export function OnboardingHero(props: OnboardingHeroProps) {
  const Icon = SLIDE_ICONS[props.slideId];

  return (
    <View style={[styles.root, { paddingTop: props.topInset + 24 }]}>
      <GridBackground lineColor={ONBOARDING_COLORS.gridLine} />
      <CornerDecor side="left" />
      <CornerDecor side="right" />
      <MitemoLogo width={72} />
      <Animated.View key={props.slideId} entering={ZoomIn.duration(450)} style={styles.halo}>
        <View testID={`onboarding-icon-${props.slideId}`} style={styles.disc}>
          <Icon size={56} color={PALETTE.brand} />
        </View>
      </Animated.View>
    </View>
  );
}

/** Fond bleu et halo de l'icône. */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    gap: 48,
    backgroundColor: ONBOARDING_COLORS.background,
  },
  halo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ONBOARDING_COLORS.halo,
  },
  disc: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PALETTE.white,
  },
});
