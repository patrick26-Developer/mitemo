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
import { TabBackground } from "./background.tab";

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

/** Recherche et filtre appliqués à la liste. */
interface ListQuery<Item> {
  readonly filter: ListFilter;
  readonly setFilter: (filter: ListFilter) => void;
  readonly query: string;
  readonly setQuery: (query: string) => void;
  /** Éléments retenus par le filtre et la recherche. */
  readonly items: readonly Item[];
  readonly empty: EmptyStateContent;
}

/**
 * Filtre et recherche de la liste, et état vide correspondant.
 * @param config Éléments et règles de la liste.
 * @returns La recherche, le filtre et leur résultat.
 */
function useListQuery<Item>(config: FilterableListConfig<Item>): ListQuery<Item> {
  const [filter, setFilter] = useState<ListFilter>("active");
  const [query, setQuery] = useState("");
  const items = config.items.filter(
    (item) =>
      matchesFilter(config.isCompleted(item), filter) && matchesSearch(config.labelOf(item), query),
  );
  const empty = searchEmptyState(query, config.searchSubject) ?? config.emptyStates[filter];
  return { filter, setFilter, query, setQuery, items, empty };
}

/** Props de l'en-tête de la liste filtrable. */
interface FilterableHeaderProps<Item> {
  readonly config: FilterableListConfig<Item>;
  readonly list: ListQuery<Item>;
  readonly onAdd: () => void;
}

/**
 * En-tête de la liste : titre, ajout, filtre et recherche. Sans aucun
 * élément, il se réduit à la marge haute : rien à filtrer ni à chercher.
 * @param props Configuration, recherche et ajout.
 * @returns L'en-tête, ou la seule marge haute.
 */
function FilterableHeader<Item>(props: FilterableHeaderProps<Item>) {
  const { config, list, onAdd } = props;
  const insets = useSafeAreaInsets();
  if (config.items.length === 0) return <View style={{ height: insets.top }} />;
  const archived =
    config.archivedLabel === undefined ? {} : { archivedLabel: config.archivedLabel };

  return (
    <ListHeader
      topInset={insets.top}
      filter={{ value: list.filter, onChange: list.setFilter, ...archived }}
      onAdd={onAdd}
      search={{ query: list.query, onChange: list.setQuery, placeholder: config.searchPlaceholder }}
    />
  );
}

/**
 * Liste filtrable d'un onglet : en-tête fixe (titre, ajout, filtre, recherche)
 * et état vide expliqué. Une liste sans aucun élément masque l'en-tête et
 * propose de créer depuis l'état vide.
 * @param props Configuration de la liste et ajout d'un élément.
 * @returns La liste filtrable.
 */
export function FilterableList<Item>(props: FilterableListProps<Item>) {
  const { config, onAdd } = props;
  const list = useListQuery(config);
  const action = config.items.length === 0 ? { action: { label: "Créer", onPress: onAdd } } : {};

  return (
    <View className="flex-1 bg-white">
      <TabBackground />
      <FlatList
        data={list.items}
        keyExtractor={config.keyOf}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={<FilterableHeader config={config} list={list} onAdd={onAdd} />}
        stickyHeaderIndices={[0]}
        ListEmptyComponent={<EmptyState {...list.empty} icon={config.emptyIcon} {...action} />}
        contentContainerClassName="grow gap-3 px-4 pb-6"
        renderItem={({ item, index }) => config.renderItem(item, index)}
      />
    </View>
  );
}
