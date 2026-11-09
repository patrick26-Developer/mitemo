import { EmptyState } from "../../../shared/components/empty-state";
import { groupSearchResults, searchEntries } from "../model/search-content";
import { SearchGroup } from "./search-group";
import { SearchSkeleton } from "./search-skeleton";
import { SearchSuggestions } from "./search-suggestions";

/** Props du corps de la recherche globale. */
export interface SearchResultsProps {
  readonly query: string;
  readonly debouncedQuery: string;
  readonly onSuggestion: (suggestion: string) => void;
}

/**
 * Choisit ce qu'il faut afficher selon l'état de la saisie : suggestions,
 * squelette de chargement, groupes de résultats ou absence de résultat.
 * @param props Saisie courante, saisie stabilisée et choix d'une suggestion.
 * @returns Le contenu de la recherche.
 */
export function SearchResults(props: SearchResultsProps) {
  const { query, debouncedQuery, onSuggestion } = props;
  const trimmedQuery = debouncedQuery.trim();
  const isDebouncing = query.trim() !== trimmedQuery && query.trim() !== "";

  if (isDebouncing) return <SearchSkeleton />;
  if (trimmedQuery === "") return <SearchSuggestions onSelect={onSuggestion} />;

  const groups = groupSearchResults(searchEntries(trimmedQuery));

  if (groups.length === 0) {
    return (
      <EmptyState
        title="Aucun résultat"
        message={`Aucune tontine, carte ou page ne correspond à « ${trimmedQuery} ».`}
      />
    );
  }

  return (
    <>
      {groups.map((group) => (
        <SearchGroup key={group.title} group={group} />
      ))}
    </>
  );
}
