import type { DockAction } from "../components/macros/dock.actions";

/** Actions d'un dock : la principale et la secondaire. */
export interface DockPair {
  readonly primary: DockAction | null;
  readonly secondary: DockAction | null;
}

/** Action d'un bouton grisé, qui ne fait rien. */
function ignore(): void {
  // Le bouton est désactivé : aucun toucher ne l'atteint.
}

/** Bouton grisé qui remplace les transactions hors connexion. */
export const OFFLINE_ACTION: DockAction = {
  label: "Hors connexion",
  onPress: ignore,
  tone: "disabled",
};

/**
 * Bloque les transactions hors connexion : pointer, cotiser, retirer ou
 * distribuer demandent le réseau, le dock n'offre alors qu'un bouton grisé.
 * @param pair Actions prévues.
 * @param online Vrai quand l'appareil a du réseau.
 * @returns Les actions à afficher.
 */
export function offlineDock(pair: DockPair, online: boolean): DockPair {
  if (online) return pair;
  if (pair.primary === null && pair.secondary === null) return pair;

  return { primary: OFFLINE_ACTION, secondary: null };
}
