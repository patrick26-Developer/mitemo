import { useState } from "react";
import { View } from "react-native";

import type { ListFilter } from "../../shared/model/list-filter";
import { ListActions } from "./list-actions";
import { ListSearchField } from "./list-search-field";
import type { SegmentedControlOption } from "./segmented-control";
import { SegmentedControl } from "./segmented-control";

/** Options affichées par le filtre d'état. */
const FILTER_OPTIONS = [
  { value: "active", label: "Actives" },
  { value: "completed", label: "Terminées" },
] as const satisfies readonly SegmentedControlOption<ListFilter>[];

/** Espace entre la zone sûre de l'écran et la barre, en points. */
const TOP_GAP = 12;

/** Réglages de la recherche inline d'une liste. */
export interface ListSearchOptions {
  readonly query?: string;
  readonly onChange?: (query: string) => void;
  readonly placeholder?: string;
}

/** Props de l'en-tête d'une liste. */
export interface ListHeaderProps {
  /** Marge haute de la zone sûre de l'écran, en points. */
  readonly topInset: number;
  readonly filter: ListFilter;
  readonly onFilterChange: (filter: ListFilter) => void;
  readonly onAdd?: () => void;
  readonly search?: ListSearchOptions;
}

/**
 * Affiche le filtre d'état d'une liste et ses actions rapides. La recherche
 * s'ouvre sur place, dans l'en-tête collant, pour ne pas quitter la liste.
 * @param props Zone sûre, filtre, changement de filtre, création et recherche.
 * @returns L'en-tête de liste.
 */
export function ListHeader(props: ListHeaderProps) {
  const { topInset, filter, onFilterChange, onAdd, search } = props;
  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const query = search?.query ?? localQuery;

  const changeQuery = (value: string) => {
    setLocalQuery(value);
    search?.onChange?.(value);
  };

  const cancelSearch = () => {
    setSearchOpen(false);
    changeQuery("");
  };

  return (
    <View
      className="flex-row items-center justify-between pb-5"
      style={{ paddingTop: topInset + TOP_GAP }}
    >
      {searchOpen ? (
        <ListSearchField
          value={query}
          onChangeText={changeQuery}
          onCancel={cancelSearch}
          placeholder={search?.placeholder ?? "Rechercher"}
        />
      ) : (
        <>
          <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={onFilterChange} />
          <ListActions
            onSearch={() => setSearchOpen(true)}
            {...(onAdd === undefined ? {} : { onAdd })}
          />
        </>
      )}
    </View>
  );
}
