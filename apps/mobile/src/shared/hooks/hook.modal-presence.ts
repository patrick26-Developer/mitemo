import { useEffect, useState } from "react";
import { Platform } from "react-native";

/**
 * Délai de secours, en millisecondes : passé ce délai, la feuille se rouvre
 * même si iOS n'a pas signalé la fin de sa fermeture.
 */
const DISMISS_FALLBACK_MS = 600;

/** Présence réelle d'une `Modal` et rappel de fin de fermeture. */
export interface ModalPresence {
  /** Visibilité à donner à la `Modal`. */
  readonly shown: boolean;
  /** À passer à `onDismiss` de la `Modal`. */
  readonly onDismiss: () => void;
}

/**
 * Retient la réouverture d'une `Modal` tant qu'iOS n'a pas fini de la fermer :
 * rouverte trop tôt (« Continuer » touché juste après « Refuser »), iOS
 * ignorait la présentation et la feuille restait invisible, tous les
 * touchers suivants sans effet. Android n'attend rien.
 * @param visible Visibilité demandée par le propriétaire.
 * @returns La visibilité à appliquer et le rappel de fin de fermeture.
 */
export function useModalPresence(visible: boolean): ModalPresence {
  const [dismissing, setDismissing] = useState(false);
  const [previous, setPrevious] = useState(visible);
  if (previous !== visible) {
    setPrevious(visible);
    if (!visible && Platform.OS === "ios") setDismissing(true);
  }
  useEffect(() => {
    if (!dismissing) return undefined;
    const timer = setTimeout(() => setDismissing(false), DISMISS_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [dismissing]);

  return { shown: visible && !dismissing, onDismiss: () => setDismissing(false) };
}
