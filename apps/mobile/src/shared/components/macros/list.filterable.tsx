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
}

/**
 * Affiche une liste filtrable, avec sa recherche et son état vide.
 * @template Item Type des éléments listés.
 * @param props Réglages de la liste et ouverture de la création.
 * @returns La liste filtrable.
 */
export function FilterableList<Item>(props: FilterableListProps<Item>) {
  const { config, onAdd } = props;
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
          <ListHeader
            topInset={insets.top}
            filter={{
              value: filter,
              onChange: setFilter,
              ...(config.archivedLabel === undefined
                ? {}
                : { archivedLabel: config.archivedLabel }),
            }}
            onAdd={onAdd}
            search={{ query, onChange: setQuery, placeholder: config.searchPlaceholder }}
          />
        }
        stickyHeaderIndices={[0]}
        ListEmptyComponent={<EmptyState {...empty} icon={config.emptyIcon} />}
        contentContainerClassName="grow gap-3 px-4 pb-6"
        renderItem={({ item, index }) => config.renderItem(item, index)}
      />
    </View>
  );
}
