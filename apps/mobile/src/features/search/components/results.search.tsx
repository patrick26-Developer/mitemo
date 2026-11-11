import { EmptyState } from "../../../shared/components/macros/state.empty";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { groupSearchResults, isSearchPending, searchEntries } from "../model/model.search-content";
import { SearchGroup } from "./group.search";
import { SearchSkeleton } from "./skeleton.search";
import { SearchSuggestions } from "./suggestions.search";

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
  const tontines = usePortfolioStore((state) => state.tontines);
  const cards = usePortfolioStore((state) => state.cards);
  const trimmedQuery = debouncedQuery.trim();

  if (isSearchPending(query, debouncedQuery)) return <SearchSkeleton />;
  if (trimmedQuery === "") return <SearchSuggestions onSelect={onSuggestion} />;

  const groups = groupSearchResults(searchEntries(trimmedQuery, tontines, cards));

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
