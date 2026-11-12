/** Paramètres d'URL d'un écran de détail, tels que les donne Expo Router. */
export interface DetailFocusParams {
  readonly action?: string | readonly string[];
  readonly member?: string | readonly string[];
}

/**
 * Endroit à ouvrir dans un écran de détail, demandé par une notification :
 * la feuille de paiement, ou la fiche d'un membre.
 */
export interface DetailFocus {
  readonly pay: boolean;
  /** Membre dont la fiche s'ouvre, `null` sinon. */
  readonly memberId: string | null;
}

/** Aucun endroit particulier : l'écran s'ouvre en haut. */
export const NO_FOCUS: DetailFocus = { pay: false, memberId: null };

/**
 * Garde la première valeur d'un paramètre d'URL.
 * @param value Valeur simple ou répétée.
 * @returns La première valeur, ou `undefined`.
 */
function first(value: string | readonly string[] | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

/**
 * Lit l'endroit à ouvrir dans les paramètres d'URL, par exemple
 * `?action=pay` ou `?member=m3` ; toute autre valeur est ignorée.
 * @param params Paramètres de l'écran.
 * @returns L'endroit à ouvrir.
 */
export function detailFocus(params: DetailFocusParams): DetailFocus {
  const member = first(params.member);
  return { pay: first(params.action) === "pay", memberId: member === "" ? null : (member ?? null) };
}
