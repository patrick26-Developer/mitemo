import { Plus, Search } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { PALETTE } from "../theme/palette";

/** Props des actions rapides d'une liste. */
export interface ListActionsProps {
  readonly onSearch: () => void;
  readonly onAdd?: () => void;
}

/**
 * Affiche la recherche et la création rapide d'une liste.
 * @param props Ouverture de la recherche et de la création.
 * @returns La pastille d'actions.
 */
export function ListActions(props: ListActionsProps) {
  const { onSearch, onAdd } = props;

  return (
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
  );
}
