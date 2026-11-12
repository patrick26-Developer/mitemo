import { useEffect } from "react";
import type { RefObject } from "react";
import { TextInput } from "react-native";
import type { ScrollViewInstance } from "react-native";

/** Espace laissé entre le champ ramené et le clavier, en points. */
export const REVEAL_MARGIN = 24;

/**
 * Attente avant de vérifier le champ, en millisecondes : le temps que le
 * clavier et la carte finissent de bouger, pour ne pas défiler pendant le
 * mouvement, ce qui faisait trembler la feuille.
 */
export const REVEAL_DELAY_MS = 320;

/**
 * Fait défiler le contenu vers le champ qui a le focus, seulement s'il est
 * caché : un champ déjà visible ne bouge pas.
 * @param scroll Zone de défilement qui contient le champ.
 */
function revealFocusedField(scroll: ScrollViewInstance): void {
  const field = TextInput.State.currentlyFocusedInput();
  if (field === null || field === undefined) return;

  scroll.scrollResponderScrollNativeHandleToKeyboard(field, REVEAL_MARGIN, true);
}

/**
 * Garde le champ en cours de saisie visible quand le clavier s'ouvre. La
 * vérification attend la fin du mouvement du clavier et ne défile que si le
 * champ est caché, pour que la feuille reste immobile dans le cas courant.
 * @param scrollRef Référence de la zone de défilement de la feuille.
 * @param keyboardHeight Hauteur du clavier, nulle quand il est fermé.
 */
export function useFocusedFieldReveal(
  scrollRef: RefObject<ScrollViewInstance | null>,
  keyboardHeight: number,
): void {
  useEffect(() => {
    const scroll = scrollRef.current;
    if (keyboardHeight === 0 || scroll === null) return undefined;

    const timer = setTimeout(() => revealFocusedField(scroll), REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [scrollRef, keyboardHeight]);
}
