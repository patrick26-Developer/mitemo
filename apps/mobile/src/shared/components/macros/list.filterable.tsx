import { useState } from "react";
import type { LucideIcon } from "lucide-react-native";
import type { ReactElement } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { EmptyStateContent } from "../../model/model.list-empty-state";
import { searchEmptyState } from "../../model/model.list-empty-state";
import { matchesFilter, matchesSearch } from "../../model/model.list-filter";
import type { ListFilter } from "../../model/model.list-filter";
import { EmptyState } from "./state.empty";
import type { ListFilterControl } from "./header.list";
import { ListHeader } from "./header.list";

/** Réglages d'une liste filtrable et recherchable. */
export interface FilterableListConfig<Item> {
  readonly items: readonly Item[];
  readonly keyOf: (item: Item) => string;
  /** Libellé sur lequel porte la recherche. */
  readonly labelOf: (item: Item) => string;
  /** Vrai quand l'élément va dans l'onglet des terminés. */
  readonly isCompleted: (item: Item) => boolean;
  /** Libellé de l'onglet des terminés, « Archivées » par défaut. */
  readonly archivedLabel?: string;
  readonly searchPlaceholder: string;
  /** Nom de l'élément recherché, au singulier et au féminin. */
  readonly searchSubject: string;
  readonly emptyStates: Readonly<Record<ListFilter, EmptyStateContent>>;
  /** Icône de l'onglet, rappelée par l'état vide. */
  readonly emptyIcon: LucideIcon;
  readonly renderItem: (item: Item, index: number) => ReactElement;
}

/** Props d'une liste filtrable et recherchable. */
export interface FilterableListProps<Item> {
  readonly config: FilterableListConfig<Item>;
  readonly onAdd: () => void;
  /** Ligne posée sous la barre de filtres, par exemple les invitations reçues. */
  readonly banner?: ReactElement | null;
}

/**
 * Construit le filtre d'état de l'en-tête, avec le libellé des terminés propre à la liste.
 * @param config Réglages de la liste.
 * @param value Filtre courant.
 * @param onChange Changement de filtre.
 * @returns Le contrôle du filtre.
 */
function filterControl<Item>(
  config: FilterableListConfig<Item>,
  value: ListFilter,
  onChange: (filter: ListFilter) => void,
): ListFilterControl {
  const archived = config.archivedLabel;
  return { value, onChange, ...(archived === undefined ? {} : { archivedLabel: archived }) };
}

/**
 * Affiche une liste filtrable, avec sa recherche et son état vide.
 * @template Item Type des éléments listés.
 * @param props Réglages de la liste, ouverture de la création et ligne d'annonce éventuelle.
 * @returns La liste filtrable.
 */
export function FilterableList<Item>(props: FilterableListProps<Item>) {
  const { config, onAdd, banner = null } = props;
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<ListFilter>("active");
  const [query, setQuery] = useState("");
  const items = config.items.filter(
    (item) =>
      matchesFilter(config.isCompleted(item), filter) && matchesSearch(config.labelOf(item), query),
  );
  const empty = searchEmptyState(query, config.searchSubject) ?? config.emptyStates[filter];

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={items}
        keyExtractor={config.keyOf}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View className="bg-white">
            <ListHeader
              topInset={insets.top}
              filter={filterControl(config, filter, setFilter)}
              onAdd={onAdd}
              search={{ query, onChange: setQuery, placeholder: config.searchPlaceholder }}
            />
            {banner}
          </View>
        }
        stickyHeaderIndices={[0]}
        ListEmptyComponent={<EmptyState {...empty} icon={config.emptyIcon} />}
        contentContainerClassName="grow gap-3 px-4 pb-6"
        renderItem={({ item, index }) => config.renderItem(item, index)}
      />
    </View>
  );
}
