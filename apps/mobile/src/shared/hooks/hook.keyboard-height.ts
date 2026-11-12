import { useEffect, useState } from "react";
import { LayoutAnimation } from "react-native";
import { KeyboardEvents } from "react-native-keyboard-controller";

/**
 * Anime le prochain changement de mise en page au rythme du clavier, ou en
 * douceur quand le système ne donne pas de durée.
 * @param duration Durée de l'animation du clavier, en millisecondes.
 */
function animateWithKeyboard(duration: number): void {
  LayoutAnimation.configureNext(
    duration > 0
      ? LayoutAnimation.create(duration, "easeInEaseOut", "opacity")
      : LayoutAnimation.Presets.easeInEaseOut,
  );
}

/**
 * Hauteur du clavier, mise à jour avant son ouverture et sa fermeture. Les
 * événements viennent de `react-native-keyboard-controller` : ceux de React
 * Native ne partent pas sur Android quand le champ est dans une feuille
 * (fenêtre `Modal`), et le clavier recouvrait alors les champs.
 * @returns La hauteur du clavier, nulle quand il est fermé.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const show = KeyboardEvents.addListener("keyboardWillShow", (event) => {
      animateWithKeyboard(event.duration);
      setHeight(event.height);
    });
    const hide = KeyboardEvents.addListener("keyboardWillHide", (event) => {
      animateWithKeyboard(event.duration);
      setHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}
