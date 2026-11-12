import { Animated, Dimensions } from "react-native";

/** Course minimale d'ouverture de la feuille, en points. */
const MIN_OPEN_OFFSET = 560;

/**
 * Course d'ouverture de la feuille, en points : toute la hauteur de l'écran,
 * pour qu'une feuille haute parte et reparte entièrement hors de l'écran.
 */
export const SHEET_OPEN_OFFSET = Math.max(MIN_OPEN_OFFSET, Dimensions.get("screen").height);

/** Ressort d'ouverture : rapide, avec une arrivée amortie. */
export const SHEET_OPEN_SPRING = {
  damping: 24,
  stiffness: 240,
  mass: 0.9,
  useNativeDriver: true,
} as const;

/** Durée de fermeture, en millisecondes. */
export const SHEET_CLOSE_DURATION = 180;

/**
 * Fait monter la feuille depuis le bas de l'écran.
 * @param translateY Translation animée de la feuille.
 */
export function openSheet(translateY: Animated.Value): void {
  Animated.spring(translateY, { toValue: 0, ...SHEET_OPEN_SPRING }).start();
}

/**
 * Ramène la feuille hors de l'écran avant de prévenir son propriétaire.
 * @param translateY Translation animée de la feuille.
 * @param onClose Fermeture demandée par le propriétaire.
 */
export function closeSheet(translateY: Animated.Value, onClose: () => void): void {
  Animated.timing(translateY, {
    toValue: SHEET_OPEN_OFFSET,
    duration: SHEET_CLOSE_DURATION,
    useNativeDriver: true,
  }).start(() => {
    translateY.setValue(SHEET_OPEN_OFFSET);
    onClose();
  });
}

/**
 * Ramène la feuille à sa position ouverte après un geste interrompu.
 * @param translateY Translation animée de la feuille.
 */
export function springBackSheet(translateY: Animated.Value): void {
  Animated.spring(translateY, { toValue: 0, ...SHEET_OPEN_SPRING }).start();
}
