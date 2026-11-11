import { useEffect, useState } from "react";
import { Keyboard, LayoutAnimation, Platform } from "react-native";
import type { KeyboardEvent } from "react-native";

/**
 * Anime le prochain changement de mise en page avec le clavier : sur iOS, au
 * rythme exact du clavier ; sur Android, dont l'événement arrive sans durée,
 * avec un fondu court, pour que la carte ne saute pas d'un coup.
 * @param event Événement du clavier.
 */
function animateWithKeyboard(event: KeyboardEvent): void {
  if (event.duration > 0) {
    Keyboard.scheduleLayoutAnimation(event);
    return;
  }

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

/**
 * Suit la hauteur du clavier pour réserver sa place dans une carte. Chaque
 * changement est animé avec le clavier.
 * @returns La hauteur du clavier en points, nulle quand il est fermé.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const isIos = Platform.OS === "ios";
    const show = Keyboard.addListener(isIos ? "keyboardWillShow" : "keyboardDidShow", (event) => {
      animateWithKeyboard(event);
      setHeight(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(isIos ? "keyboardWillHide" : "keyboardDidHide", (event) => {
      animateWithKeyboard(event);
      setHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}
