import { useMemo } from "react";
import { PanResponder } from "react-native";
import type { Animated, PanResponderGestureState } from "react-native";

import { closeSheet, springBackSheet } from "../model/model.sheet-animation";
import { shouldDismissSheet } from "../model/model.sheet-gesture";

/** Distance minimale, en points, avant de considérer un glissement vertical. */
const DRAG_START_DISTANCE = 4;

/**
 * Déplace la feuille pendant le geste, sans la faire remonter au-delà de sa
 * position ouverte.
 * @param translateY Translation animée de la feuille.
 * @param dy Distance parcourue vers le bas, en points.
 */
function moveSheet(translateY: Animated.Value, dy: number): void {
  if (dy > 0) translateY.setValue(dy);
}

/**
 * Ferme la feuille si le geste est assez franc, sinon la remet en place.
 * @param translateY Translation animée de la feuille.
 * @param gesture État final du geste.
 * @param onClose Fermeture demandée par le propriétaire.
 */
function releaseSheet(
  translateY: Animated.Value,
  gesture: PanResponderGestureState,
  onClose: () => void,
): void {
  if (shouldDismissSheet(gesture.dy, gesture.vy)) {
    closeSheet(translateY, onClose);
    return;
  }

  springBackSheet(translateY);
}

/**
 * Crée les gestionnaires du glissement de fermeture.
 * @param translateY Translation animée de la feuille.
 * @param onClose Fermeture demandée par le propriétaire.
 * @returns Le gestionnaire de geste de la feuille.
 */
function createSheetPanResponder(translateY: Animated.Value, onClose: () => void) {
  return PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      gesture.dy > DRAG_START_DISTANCE && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderMove: (_, gesture) => moveSheet(translateY, gesture.dy),
    onPanResponderRelease: (_, gesture) => releaseSheet(translateY, gesture, onClose),
    onPanResponderTerminate: () => springBackSheet(translateY),
  });
}

/**
 * Donne à l'en-tête d'une feuille le geste de fermeture par glissement.
 * @param translateY Translation animée de la feuille.
 * @param onClose Fermeture demandée par le propriétaire.
 * @returns Les gestionnaires de geste à poser sur l'en-tête.
 */
export function useSheetDrag(translateY: Animated.Value, onClose: () => void) {
  const panResponder = useMemo(
    () => createSheetPanResponder(translateY, onClose),
    [translateY, onClose],
  );

  return panResponder.panHandlers;
}
