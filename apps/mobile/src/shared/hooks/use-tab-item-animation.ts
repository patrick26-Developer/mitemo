import { useEffect } from "react";
import {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

import { PALETTE } from "@/shared/theme/palette";

const COLLAPSED_WIDTH = 56;
const EXPANDED_WIDTH = 132;

/**
 * Anime la pastille d'un onglet quand il prend ou perd le focus.
 * @param focused Vrai quand l'onglet est l'onglet actif.
 * @returns Les styles animés de la pastille, de l'icône et du libellé.
 */
export function useTabItemAnimation(focused: boolean) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused, progress]);

  return useTabItemStyles(progress);
}

/**
 * Décrit les trois styles animés d'un onglet pour une progression donnée.
 * @param progress Progression de 0 (au repos) à 1 (actif).
 * @returns Styles de la pastille, du libellé et de l'icône.
 */
function useTabItemStyles(progress: SharedValue<number>) {
  const pillStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [COLLAPSED_WIDTH, EXPANDED_WIDTH]),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(220,233,245,0)", PALETTE.tabActive],
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.4, 1], [0, 1], "clamp"),
    transform: [{ translateX: interpolate(progress.value, [0, 1], [-8, 0]) }],
    maxWidth: interpolate(progress.value, [0, 1], [0, 90]),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 0.8]) }],
  }));

  return { pillStyle, labelStyle, iconStyle };
}
