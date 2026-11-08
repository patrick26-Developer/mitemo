import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { PALETTE } from "../../shared/theme/palette";

/** Hauteur de la barre, en points. */
const TRACK_HEIGHT = 18;

/** Props de la barre de progression. */
export interface ProgressBarProps {
  /** Part remplie, entre 0 et 1. */
  readonly value: number;
}

/**
 * Affiche une barre de progression qui se remplit à l'apparition.
 * @param props Part remplie de la barre.
 * @returns La barre de progression animée.
 */
export function ProgressBar(props: ProgressBarProps) {
  const { value } = props;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      400,
      withTiming(value, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress, value]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View className="flex-1 overflow-hidden rounded-full bg-brand-veil" style={FILL_HEIGHT}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

/** Hauteur de la piste, partagée par la piste et le remplissage. */
const FILL_HEIGHT = { height: TRACK_HEIGHT };

/** Animated.View n'accepte pas de className : le remplissage reste stylé ici. */
const styles = StyleSheet.create({
  fill: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: PALETTE.brand,
  },
});
