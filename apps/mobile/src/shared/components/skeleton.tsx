import { useEffect, useState } from "react";
import { Animated } from "react-native";
import type { DimensionValue } from "react-native";

import { PALETTE } from "../theme/palette";

/** Opacité basse de la pulsation. */
const LOW_OPACITY = 0.45;

/** Durée d'une demi-pulsation, en millisecondes. */
const PULSE_DURATION = 700;

/** Props d'un bloc de chargement. */
export interface SkeletonProps {
  /** Hauteur du bloc, en points. */
  readonly height?: number;
  /** Largeur du bloc ; pleine largeur par défaut. */
  readonly width?: DimensionValue;
  /** Rayon des coins, en points. */
  readonly radius?: number;
}

/**
 * Affiche un bloc gris qui respire pendant l'attente d'un contenu, à la place
 * d'un écran vide qui donnerait l'impression que l'application est figée.
 * @param props Dimensions du bloc.
 * @returns Le bloc de chargement animé.
 */
export function Skeleton(props: SkeletonProps) {
  const { height = 16, width = "100%", radius = 8 } = props;
  const [opacity] = useState(() => new Animated.Value(LOW_OPACITY));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: LOW_OPACITY,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      testID="skeleton"
      style={{ height, width, borderRadius: radius, backgroundColor: PALETTE.tabActive, opacity }}
    />
  );
}
