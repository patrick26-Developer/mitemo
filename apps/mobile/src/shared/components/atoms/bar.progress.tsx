import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { accentColors } from "../../model/model.accent-color";
import { PALETTE } from "../../theme/theme.palette";

/** Hauteur de la barre, en points. */
const TRACK_HEIGHT = 18;

/** Props de la barre de progression. */
export interface ProgressBarProps {
  /** Part remplie, entre 0 et 1. */
  readonly value: number;
  /**
   * Couleur d'action de l'écran, par exemple la teinte d'une carte : le
   * remplissage prend sa nuance vive et la piste la même nuance, très claire.
   */
  readonly accent?: string;
}

/** Opacité de la piste teintée, en suffixe hexadécimal (20 %). */
const ACCENT_TRACK_ALPHA = "33";

/**
 * Affiche une barre de progression qui se remplit à l'apparition.
 * @param props Part remplie de la barre et couleur d'action.
 * @returns La barre de progression animée.
 */
export function ProgressBar(props: ProgressBarProps) {
  const { value, accent } = props;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      400,
      withTiming(value, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress, value]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  const tinted = accent === undefined ? null : accentColors(accent).background;

  return (
    <View
      testID="progress-track"
      className={`flex-1 overflow-hidden rounded-full ${tinted === null ? "bg-brand-veil" : ""}`}
      style={
        tinted === null
          ? FILL_HEIGHT
          : [FILL_HEIGHT, { backgroundColor: `${tinted}${ACCENT_TRACK_ALPHA}` }]
      }
    >
      <Animated.View
        testID="progress-fill"
        style={[styles.fill, tinted === null ? null : { backgroundColor: tinted }, fillStyle]}
      />
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
