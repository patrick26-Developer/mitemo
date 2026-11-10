import type { ReactNode } from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

/** Échelle appliquée pendant l'appui : assez pour être perçue, sans secousse. */
const PRESSED_SCALE = 0.97;

/** Ressort de l'appui, rapide et sans rebond visible. */
const PRESS_SPRING = { damping: 18, stiffness: 320 };

/** Absorbe l'appui d'une zone désactivée, sans propager l'événement. */
function ignorePress(): void {}

/** Props d'une zone pressable animée. */
export interface PressableScaleProps {
  readonly children: ReactNode;
  readonly onPress?: () => void;
  readonly accessibilityLabel: string;
  readonly className?: string;
  /** Échelle atteinte pendant l'appui, `0.97` par défaut. */
  readonly scaleTo?: number;
  /** Empêche l'action et atténue l'appui. */
  readonly disabled?: boolean;
  readonly testID?: string;
}

/**
 * Enveloppe un contenu d'un appui qui se rétracte légèrement, pour que chaque
 * action réponde immédiatement au doigt.
 * @param props Contenu, action et libellé d'accessibilité.
 * @returns La zone pressable animée.
 */
export function PressableScale(props: PressableScaleProps) {
  const {
    children,
    onPress,
    accessibilityLabel,
    className,
    scaleTo = PRESSED_SCALE,
    disabled = false,
    testID,
  } = props;
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const pressIn = () => {
    scale.set(withSpring(scaleTo, PRESS_SPRING));
  };

  const pressOut = () => {
    scale.set(withSpring(1, PRESS_SPRING));
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      className={className ?? ""}
      onPress={disabled ? ignorePress : onPress}
      onPressIn={disabled ? undefined : pressIn}
      onPressOut={pressOut}
      {...(testID === undefined ? {} : { testID })}
    >
      <Animated.View style={style}>{children}</Animated.View>
    </Pressable>
  );
}
