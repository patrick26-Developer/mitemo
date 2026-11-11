import { useState } from "react";
import { View } from "react-native";

import type { ListFilter } from "../../model/model.list-filter";
import { ListActions } from "./actions.list";
import { SearchField } from "./field.search";
import type { SegmentedControlOption } from "./control.segmented";
import { SegmentedControl } from "./control.segmented";

/** Libellé par défaut de l'onglet des éléments terminés. */
const DEFAULT_ARCHIVED_LABEL = "Archivées";

/** Filtre d'état d'une liste : valeur, changement et libellé des terminés. */
export interface ListFilterControl {
  readonly value: ListFilter;
  readonly onChange: (filter: ListFilter) => void;
  /** Libellé de l'onglet des éléments terminés, « Archivées » par défaut. */
  readonly archivedLabel?: string;
}

/**
 * Construit les deux onglets du filtre d'état.
 * @param archivedLabel Libellé de l'onglet des éléments terminés.
 * @returns Les options du filtre.
 */
function filterOptions(archivedLabel: string): readonly SegmentedControlOption<ListFilter>[] {
  return [
    { value: "active", label: "Actives" },
    { value: "completed", label: archivedLabel },
  ];
}

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
  readonly filter: ListFilterControl;
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
  const { topInset, filter, onAdd, search } = props;
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
        <SearchField
          value={query}
          onChangeText={changeQuery}
          placeholder={search?.placeholder ?? "Rechercher"}
          accessibilityLabel="Rechercher dans la liste"
          clear={{ label: "Annuler la recherche", onPress: cancelSearch, alwaysVisible: true }}
        />
      ) : (
        <ListToolbar filter={filter} onSearch={() => setSearchOpen(true)} onAdd={onAdd} />
      )}
    </View>
  );
}

/** Props de la barre d'outils de la liste. */
interface ListToolbarProps {
  readonly filter: ListFilterControl;
  readonly onSearch: () => void;
  readonly onAdd: (() => void) | undefined;
}

/**
 * Pose le filtre d'état et les actions rapides, quand la recherche est fermée.
 * @param props Filtre, ouverture de la recherche et création.
 * @returns Le filtre et les actions.
 */
function ListToolbar(props: ListToolbarProps) {
  const { filter, onSearch, onAdd } = props;

  return (
    <>
      <SegmentedControl
        options={filterOptions(filter.archivedLabel ?? DEFAULT_ARCHIVED_LABEL)}
        value={filter.value}
        onChange={filter.onChange}
      />
      <ListActions onSearch={onSearch} {...(onAdd === undefined ? {} : { onAdd })} />
    </>
  );
}
