import { Animated } from "react-native";

import { SHEET_OPEN_OFFSET, closeSheet, openSheet, springBackSheet } from "./model.sheet-animation";

/** Réglages passés à une animation, pour vérifier son moteur. */
interface AnimationConfig {
  readonly useNativeDriver: boolean;
}

/**
 * Animation simulée qui se termine aussitôt.
 * @returns L'animation, à renvoyer par `Animated.spring` ou `Animated.timing`.
 */
function finishedAnimation(): Animated.CompositeAnimation {
  return {
    start: (callback?: (result: { finished: boolean }) => void) => callback?.({ finished: true }),
    stop: jest.fn(),
    reset: jest.fn(),
  };
}

/**
 * Valeur courante côté JavaScript, celle qu'un nouveau rendu réapplique.
 * @param value Valeur animée.
 * @returns La valeur lue.
 */
function jsValueOf(value: Animated.Value): number {
  let current = Number.NaN;
  value.stopAnimation((read) => {
    current = read;
  });
  return current;
}

describe("animation de la feuille", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("ouvre la feuille côté JavaScript : un rendu pendant l'ouverture (clavier) ne la renvoie pas hors de l'écran", () => {
    const spring = jest.spyOn(Animated, "spring").mockReturnValue(finishedAnimation());
    const translateY = new Animated.Value(SHEET_OPEN_OFFSET);

    openSheet(translateY);

    const config = spring.mock.calls[0]?.[1] as AnimationConfig | undefined;
    expect(config?.useNativeDriver).toBe(false);
    expect(jsValueOf(translateY)).toBe(0);
  });

  it("ramène la feuille en place côté JavaScript après un glissement", () => {
    const spring = jest.spyOn(Animated, "spring").mockReturnValue(finishedAnimation());
    const translateY = new Animated.Value(120);

    springBackSheet(translateY);

    const config = spring.mock.calls[0]?.[1] as AnimationConfig | undefined;
    expect(config?.useNativeDriver).toBe(false);
    expect(jsValueOf(translateY)).toBe(0);
  });

  it("ferme la feuille côté JavaScript, puis prévient le propriétaire", () => {
    const timing = jest.spyOn(Animated, "timing").mockReturnValue(finishedAnimation());
    const translateY = new Animated.Value(0);
    const onClose = jest.fn();

    closeSheet(translateY, onClose);

    const config = timing.mock.calls[0]?.[1] as AnimationConfig | undefined;
    expect(config?.useNativeDriver).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
