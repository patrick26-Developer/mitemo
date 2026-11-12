import { Animated } from "react-native";

import { SHEET_OPEN_OFFSET, openSheet, springBackSheet } from "./model.sheet-animation";

/**
 * Remplace le ressort par une animation native qui se termine sans toucher à
 * la valeur côté JavaScript, comme sur l'appareil.
 */
function mockNativeSpring(): void {
  jest.spyOn(Animated, "spring").mockReturnValue({
    start: (callback?: (result: { finished: boolean }) => void) => callback?.({ finished: true }),
    stop: jest.fn(),
    reset: jest.fn(),
  });
}

/**
 * Valeur courante côté JavaScript.
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

  it("aligne la position JavaScript sur la feuille ouverte, pour qu'un nouveau rendu ne la renvoie pas hors de l'écran", () => {
    mockNativeSpring();
    const translateY = new Animated.Value(SHEET_OPEN_OFFSET);

    openSheet(translateY);

    expect(jsValueOf(translateY)).toBe(0);
  });

  it("fait de même quand la feuille revient en place après un glissement", () => {
    mockNativeSpring();
    const translateY = new Animated.Value(120);

    springBackSheet(translateY);

    expect(jsValueOf(translateY)).toBe(0);
  });
});
