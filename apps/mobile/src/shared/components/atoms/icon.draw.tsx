import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import type { Path } from "react-native-svg";
import Svg, { Path as SvgPath } from "react-native-svg";

/** Côté du carré de dessin des icônes, en points. */
const VIEWBOX_SIZE = 24;

/** Longueur de repli quand la mesure native n'est pas disponible. */
const FALLBACK_LENGTH = 100;

/** Durée d'un trait, en millisecondes. */
const DEFAULT_DURATION = 520;

/** Délai entre deux traits d'une même icône, en millisecondes. */
const DEFAULT_STAGGER = 120;

/** Épaisseur de trait par défaut, en points. */
const DEFAULT_STROKE_WIDTH = 1.8;

const AnimatedPath = Animated.createAnimatedComponent(SvgPath);

/** Props d'une icône dessinée trait par trait. */
export interface DrawIconProps {
  /** Traits de l'icône, dans l'ordre de dessin. */
  readonly paths: readonly string[];
  readonly color: string;
  /** Côté de l'icône, en points. */
  readonly size?: number;
  readonly strokeWidth?: number;
  /** Délai avant le premier trait, en millisecondes. */
  readonly delay?: number;
  /** Délai entre deux traits, en millisecondes. */
  readonly stagger?: number;
  /** Durée d'un trait, en millisecondes. */
  readonly duration?: number;
  readonly testID?: string | undefined;
}

/** Props d'un trait animé. */
interface DrawPathProps {
  readonly d: string;
  readonly color: string;
  readonly strokeWidth: number;
  readonly delay: number;
  readonly duration: number;
}

/** Props des traits d'une icône. */
interface DrawPathsProps {
  readonly paths: readonly string[];
  readonly color: string;
  readonly strokeWidth: number;
  readonly delay: number;
  readonly stagger: number;
  readonly duration: number;
}

/**
 * Mesure la longueur d'un trait, avec une valeur de repli si la mesure native
 * n'est pas disponible (notamment dans les tests).
 * @param node Trait à mesurer.
 * @returns La longueur du trait, en points.
 */
function measureLength(node: Path | null): number {
  if (node === null) return FALLBACK_LENGTH;

  try {
    const measured = node.getTotalLength();
    return measured !== undefined && measured > 0 ? measured : FALLBACK_LENGTH;
  } catch {
    return FALLBACK_LENGTH;
  }
}

/**
 * Dessine un trait en le révélant progressivement, du début vers la fin.
 * @param props Tracé, couleur et minutage du trait.
 * @returns Le trait animé.
 */
function DrawPath(props: DrawPathProps) {
  const { d, color, strokeWidth, delay, duration } = props;
  const ref = useRef<Path | null>(null);
  const [length, setLength] = useState<number | null>(null);
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setLength(measureLength(ref.current));
  }, []);

  useEffect(() => {
    if (length === null) return;

    progress.value = reducedMotion
      ? 1
      : withDelay(delay, withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }));
  }, [delay, duration, length, progress, reducedMotion]);

  const dashLength = length ?? FALLBACK_LENGTH;
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashLength * (1 - progress.value),
  }));

  return (
    <AnimatedPath
      ref={ref}
      d={d}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray={[dashLength, dashLength]}
      animatedProps={animatedProps}
    />
  );
}

/**
 * Affiche les traits d'une icône, décalés les uns après les autres.
 * @param props Traits et minutage.
 * @returns Les traits animés.
 */
function DrawPaths(props: DrawPathsProps) {
  const { paths, color, strokeWidth, delay, stagger, duration } = props;

  return (
    <>
      {paths.map((d, index) => (
        <DrawPath
          key={d}
          d={d}
          color={color}
          strokeWidth={strokeWidth}
          delay={delay + index * stagger}
          duration={duration}
        />
      ))}
    </>
  );
}

/**
 * Affiche une icône filaire qui se dessine trait par trait à son apparition.
 * L'animation est ignorée quand le membre a demandé à réduire les animations.
 * @param props Traits, couleur et minutage de l'icône.
 * @returns L'icône animée.
 */
export function DrawIcon(props: DrawIconProps) {
  const {
    paths,
    color,
    size = 20,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    delay = 0,
    stagger = DEFAULT_STAGGER,
    duration = DEFAULT_DURATION,
    testID,
  } = props;

  return (
    <View
      {...(testID === undefined ? {} : { testID })}
      style={{ width: size, height: size }}
      pointerEvents="none"
      accessible={false}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        fill="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <DrawPaths
          paths={paths}
          color={color}
          strokeWidth={strokeWidth}
          delay={delay}
          stagger={stagger}
          duration={duration}
        />
      </Svg>
    </View>
  );
}
