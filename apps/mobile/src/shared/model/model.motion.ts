import { ReduceMotion } from "react-native-reanimated";

/**
 * Mode de réduction des animations de Reanimated selon la préférence du
 * membre : le réglage d'accessibilité du système tant qu'il garde les
 * animations, sinon aucune animation.
 * @param animations `true` quand le membre garde les animations.
 * @returns Le mode à appliquer à toute l'application.
 */
export function reduceMotionMode(animations: boolean): ReduceMotion {
  return animations ? ReduceMotion.System : ReduceMotion.Always;
}
