import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import { KeyboardEvents } from "react-native-keyboard-controller";

/** Abonnement à retirer au démontage. */
interface Subscription {
  readonly remove: () => void;
}

/**
 * Suit le clavier d'iOS avec les événements de React Native et fait glisser
 * la mise en page au rythme exact du clavier.
 * @param setHeight Mise à jour de la hauteur.
 * @returns Les abonnements à l'ouverture et à la fermeture.
 */
function followIosKeyboard(setHeight: (height: number) => void): readonly Subscription[] {
  return [
    Keyboard.addListener("keyboardWillShow", (event) => {
      Keyboard.scheduleLayoutAnimation(event);
      setHeight(event.endCoordinates.height);
    }),
    Keyboard.addListener("keyboardWillHide", (event) => {
      Keyboard.scheduleLayoutAnimation(event);
      setHeight(0);
    }),
  ];
}

/**
 * Suit le clavier d'Android avec `react-native-keyboard-controller` : les
 * événements de React Native ne partent pas quand le champ est dans une
 * feuille (fenêtre `Modal`). Pas d'animation de mise en page : elle effaçait
 * la carte dans la fenêtre d'une feuille.
 * @param setHeight Mise à jour de la hauteur.
 * @returns Les abonnements à l'ouverture et à la fermeture.
 */
function followAndroidKeyboard(setHeight: (height: number) => void): readonly Subscription[] {
  return [
    KeyboardEvents.addListener("keyboardWillShow", (event) => setHeight(event.height)),
    KeyboardEvents.addListener("keyboardWillHide", () => setHeight(0)),
  ];
}

/**
 * Hauteur du clavier, mise à jour avant son ouverture et sa fermeture.
 * @returns La hauteur du clavier, nulle quand il est fermé.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const follow = Platform.OS === "ios" ? followIosKeyboard : followAndroidKeyboard;
    const subscriptions = follow(setHeight);
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, []);

  return height;
}
