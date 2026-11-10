import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

/**
 * Suit la hauteur du clavier pour réserver sa place dans une carte.
 * @returns La hauteur du clavier en points, nulle quand il est fermé.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const isIos = Platform.OS === "ios";
    const show = Keyboard.addListener(isIos ? "keyboardWillShow" : "keyboardDidShow", (event) =>
      setHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener(isIos ? "keyboardWillHide" : "keyboardDidHide", () => {
      setHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}
