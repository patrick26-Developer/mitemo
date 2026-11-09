import { Plus, Search } from "lucide-react-native";
import { Pressable, View } from "react-native";

import type { ListFilter } from "../../shared/model/list-filter";
import { PALETTE } from "../../shared/theme/palette";
import type { SegmentedControlOption } from "./segmented-control";
import { SegmentedControl } from "./segmented-control";

/** Options affichées par le filtre d'état. */
const FILTER_OPTIONS = [
  { value: "active", label: "Actives" },
  { value: "completed", label: "Terminées" },
] as const satisfies readonly SegmentedControlOption<ListFilter>[];

/** Props de l'en-tête d'une liste. */
export interface ListHeaderProps {
  readonly filter: ListFilter;
  readonly onFilterChange: (filter: ListFilter) => void;
  /** Action de recherche, absente tant que l'écran dédié n'existe pas. */
  readonly onSearch?: () => void;
  /** Action de création, absente tant que l'écran dédié n'existe pas. */
  readonly onAdd?: () => void;
}

/**
 * Affiche le filtre d'état d'une liste et ses actions rapides.
 *
 * Posé en `ListHeaderComponent` collant d'une `FlatList`, il reste en haut de
 * l'écran pendant que les éléments défilent dessous, d'où son fond opaque.
 * @param props Filtre courant, changement de filtre et actions.
 * @returns L'en-tête de liste.
 */
export function ListHeader(props: ListHeaderProps) {
  const { filter, onFilterChange, onSearch, onAdd } = props;

  return (
    <View className="flex-row items-center justify-between bg-white pb-5">
      <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={onFilterChange} />

      <View className="flex-row items-center gap-3 rounded-[22px] border border-rule-border bg-tab-active px-3 py-2.5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Rechercher"
          hitSlop={8}
          onPress={onSearch}
        >
          <Search size={20} color={PALETTE.tabInk} />
        </Pressable>
        <View className="h-3.5 w-px bg-white" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ajouter"
          hitSlop={8}
          onPress={onAdd}
        >
          <Plus size={20} color={PALETTE.tabInk} />
        </Pressable>
      </View>
    </View>
  );
}
