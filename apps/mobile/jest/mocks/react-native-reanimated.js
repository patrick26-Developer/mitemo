import { Text, View } from "react-native";

/**
 * Double de test de Reanimated : son implémentation native et son
 * implémentation web (DOM) sont inutilisables dans l'environnement React Native
 * de Jest. Les animations gardent leur forme finale, ce qui suffit à tester le
 * contenu et les interactions ; les valeurs intermédiaires ne sont pas vérifiées.
 */

/**
 * Renvoie sa valeur d'entrée, comme une courbe d'accélération neutre.
 * @param {unknown} value Valeur à renvoyer.
 * @returns {unknown} La même valeur.
 */
function identity(value) {
  return value;
}

/**
 * Renvoie la dernière valeur de sortie d'une interpolation.
 * @param {unknown} value Valeur d'entrée, ignorée.
 * @param {unknown} input Plage d'entrée, ignorée.
 * @param {readonly unknown[]} output Valeurs de sortie.
 * @returns {unknown} La dernière valeur de sortie.
 */
function finalValue(value, input, output) {
  return output[output.length - 1];
}

/**
 * Évalue immédiatement le style animé, sans étape intermédiaire.
 * @param {() => object} factory Fabrique du style animé.
 * @returns {object} Le style calculé.
 */
function animatedStyle(factory) {
  return factory();
}

/**
 * Retourne une valeur partagée minimale, modifiable par affectation.
 * @param {unknown} initial Valeur initiale.
 * @returns {{ value: unknown }} La valeur partagée.
 */
function sharedValue(initial) {
  return { value: initial };
}

/**
 * Ignore le délai et rend la valeur immédiatement.
 * @param {number} delay Délai en millisecondes, ignoré.
 * @param {unknown} value Valeur à rendre.
 * @returns {unknown} La même valeur.
 */
function delayed(delay, value) {
  return value;
}

/**
 * Conserve l'animation d'entrée pour permettre le chaînage `delay().duration()`.
 * @returns {{ delay: () => unknown, duration: () => unknown }} L'animation d'entrée.
 */
function keepEntering() {
  return entering;
}

const entering = { delay: keepEntering, duration: keepEntering };

export default {
  View,
  Text,
};

export const Easing = { out: identity, cubic: identity };
export const FadeInDown = entering;
export const FadeInRight = entering;
export const interpolate = finalValue;
export const interpolateColor = finalValue;
export const useAnimatedStyle = animatedStyle;
export const useSharedValue = sharedValue;
export const withDelay = delayed;
export const withTiming = identity;
