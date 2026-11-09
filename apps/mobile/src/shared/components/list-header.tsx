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

/** Espace entre la zone sûre de l'écran et la barre, en points. */
const TOP_GAP = 12;

/** Props de l'en-tête d'une liste. */
export interface ListHeaderProps {
  /** Marge haute de la zone sûre de l'écran, en points. */
  readonly topInset: number;
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
 * l'écran pendant que les éléments défilent dessous. Son fond reste
 * transparent : les cartes passent derrière les contrôles, qui portent leur
 * propre fond. La marge de zone sûre est portée par l'en-tête pour que les
 * cartes défilent jusqu'au bord haut de l'écran.
 * @param props Zone sûre, filtre courant, changement de filtre et actions.
 * @returns L'en-tête de liste.
 */
export function ListHeader(props: ListHeaderProps) {
  const { topInset, filter, onFilterChange, onSearch, onAdd } = props;
  const style = { paddingTop: topInset + TOP_GAP };

  return (
    <View className="flex-row items-center justify-between pb-5" style={style}>
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
