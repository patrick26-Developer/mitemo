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

/**
 * Retire les accents et la casse d'un libellé pour une recherche tolérante.
 * @param value Texte à normaliser.
 * @returns Le texte en minuscules, sans accents.
 */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}

/**
 * Indique si un libellé contient la recherche en cours.
 * @param label Libellé de l'élément.
 * @param query Recherche saisie ; vide, elle accepte tout.
 * @returns Vrai si l'élément correspond à la recherche.
 */
export function matchesSearch(label: string, query: string): boolean {
  const needle = normalize(query.trim());

  return needle === "" || normalize(label).includes(needle);
}
