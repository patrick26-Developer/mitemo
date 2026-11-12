import { Image, ScrollView, Text, View } from "react-native";

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
  const shared = {
    value: initial,
    get: () => shared.value,
    set: (next) => {
      shared.value = typeof next === "function" ? next(shared.value) : next;
    },
  };

  return shared;
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
 * Conserve l'animation d'entrée pour permettre ses chaînages : délai, durée,
 * ressort et courbe.
 * @returns {{ delay: () => unknown, duration: () => unknown, springify: () => unknown, damping: () => unknown, stiffness: () => unknown, easing: () => unknown }} L'animation d'entrée.
 */
function keepEntering() {
  return entering;
}

const entering = {
  delay: keepEntering,
  duration: keepEntering,
  springify: keepEntering,
  damping: keepEntering,
  stiffness: keepEntering,
  easing: keepEntering,
};

/**
 * Rend immédiatement la dernière valeur d'une séquence.
 * @param {...unknown} values Valeurs de la séquence.
 * @returns {unknown} La dernière valeur.
 */
function lastValue(...values) {
  return values[values.length - 1];
}

/**
 * Rend une courbe d'accélération neutre.
 * @returns {unknown} La fonction d'identité.
 */
function bezierEasing() {
  return identity;
}

/**
 * Exécute immédiatement une fonction prévue pour le fil UI.
 * @param {() => void} callback Fonction à exécuter.
 * @returns {() => void} La même fonction.
 */
function runOnJSCallback(callback) {
  return callback;
}

/**
 * Laisse le composant inchangé : les props animées sont calculées à la main.
 * @param {unknown} component Composant à animer.
 * @returns {unknown} Le même composant.
 */
function createAnimatedComponent(component) {
  return component;
}

export default {
  View,
  Text,
  Image,
  ScrollView,
  createAnimatedComponent,
};

export const Easing = {
  out: identity,
  cubic: identity,
  linear: identity,
  inOut: identity,
  bezier: bezierEasing,
};
/**
 * Animation par images clés, sans effet dans les tests : la vue garde sa forme finale.
 */
export class Keyframe {
  /**
   * Retient les images clés, ignorées.
   * @param {object} definitions Images clés de l'animation.
   */
  constructor(definitions) {
    this.definitions = definitions;
  }

  /**
   * Ignore la durée.
   * @returns {Keyframe} La même animation.
   */
  duration() {
    return this;
  }

  /**
   * Ignore le délai.
   * @returns {Keyframe} La même animation.
   */
  delay() {
    return this;
  }
}

export const FadeIn = entering;
export const FadeInDown = entering;
export const FadeInRight = entering;
export const FadeOut = entering;
export const SlideInDown = entering;
export const SlideInLeft = entering;
export const SlideInRight = entering;
export const SlideOutDown = entering;
export const ZoomIn = entering;
export const interpolate = finalValue;
export const interpolateColor = finalValue;
export const runOnJS = runOnJSCallback;
/**
 * Ignore la préférence de réduction des animations dans les tests.
 * @returns {boolean} Faux, pour laisser les animations se jouer.
 */
export function useReducedMotion() {
  return false;
}

export const useAnimatedStyle = animatedStyle;
export const useAnimatedProps = animatedStyle;
export const useSharedValue = sharedValue;
export const withDelay = delayed;
export const withRepeat = identity;
export const withSequence = lastValue;
export const withSpring = identity;
export const withTiming = identity;
