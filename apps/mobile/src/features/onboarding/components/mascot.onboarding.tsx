import type { ComponentType } from "react";
import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg from "react-native-svg";

import type { OnboardingSlideId } from "../model/model.onboarding-slides";
import { MascotBody } from "../../../shared/components/atoms/body.mascot";
import { MascotCoins } from "./prop.mascot-coins";
import { MascotFriends } from "./prop.mascot-friends";
import { MascotPhone } from "./prop.mascot-phone";

/** Accessoire de Temo pour chaque page de la présentation. */
const SLIDE_PROPS: Readonly<Record<OnboardingSlideId, ComponentType>> = {
  tontines: MascotFriends,
  payment: MascotPhone,
  savings: MascotCoins,
};

/** Respiration de Temo : il flotte doucement, de 6 points, en boucle. */
const FLOAT = { offset: -6, duration: 1400, easing: Easing.inOut(Easing.sin) };

/** Props de la mascotte de la présentation. */
export interface OnboardingMascotProps {
  readonly slideId: OnboardingSlideId;
}

/**
 * Temo, la mascotte de Mitemo, avec l'accessoire de la page : ses amis pour
 * les tontines, un téléphone pour les paiements, une pile de pièces pour
 * l'épargne. Il flotte doucement ; il reste décoratif pour les lecteurs
 * d'écran, le texte de la page portant le message.
 * @param props Page courante.
 * @returns La mascotte animée.
 */
export function OnboardingMascot(props: OnboardingMascotProps) {
  const Prop = SLIDE_PROPS[props.slideId];
  const lift = useSharedValue(0);
  const float = useAnimatedStyle(() => ({ transform: [{ translateY: lift.get() }] }));
  useEffect(() => {
    lift.set(withRepeat(withTiming(FLOAT.offset, FLOAT), -1, true));
  }, [lift]);

  return (
    <Animated.View
      testID={`onboarding-mascot-${props.slideId}`}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={float}
    >
      <Svg width={220} height={200} viewBox="0 0 220 200">
        <MascotBody />
        <Prop />
      </Svg>
    </Animated.View>
  );
}
