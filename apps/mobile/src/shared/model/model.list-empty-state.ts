/** Contenu affiché quand une liste ne retient aucun élément. */
export interface EmptyStateContent {
  readonly title: string;
  readonly message: string;
}

/**
 * Message d'état vide d'une recherche, ou `null` quand la recherche est vide.
 * @param query Recherche saisie.
 * @param subject Nom de l'élément recherché, au singulier et au féminin.
 * @returns Le message de recherche vide, ou `null`.
 */
export function searchEmptyState(query: string, subject: string): EmptyStateContent | null {
  const trimmed = query.trim();

  if (trimmed === "") return null;

  return {
    title: "Aucun résultat",
    message: `Aucune ${subject} ne correspond à « ${trimmed} ».`,
  };
}
