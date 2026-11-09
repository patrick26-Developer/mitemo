/** Filtres d'état proposés par les listes de tontines et de cartes. */
export const LIST_FILTERS = ["active", "completed"] as const;

/** Filtre d'état d'une liste. Voir {@link LIST_FILTERS}. */
export type ListFilter = (typeof LIST_FILTERS)[number];

/**
 * Indique si un élément correspond au filtre d'état demandé.
 * @param completed Vrai si l'élément est terminé.
 * @param filter Filtre courant.
 * @returns Vrai si l'élément doit être affiché.
 */
export function matchesFilter(completed: boolean, filter: ListFilter): boolean {
  return completed === (filter === "completed");
}
