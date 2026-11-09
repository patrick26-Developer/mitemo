import { useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "../../../shared/components/empty-state";
import { ListHeader } from "../../../shared/components/list-header";
import { DEMO_SAVINGS } from "../../../shared/demo/savings";
import { matchesFilter } from "../../../shared/model/list-filter";
import type { ListFilter } from "../../../shared/model/list-filter";
import { FULL_CARD_WIDTH } from "../../../shared/theme/card-layout";
import { SavingsCard } from "./savings-card";

/** Message affiché quand le filtre ne retient aucune carte. */
const EMPTY_STATES: Readonly<Record<ListFilter, { title: string; message: string }>> = {
  active: {
    title: "Aucune carte active",
    message: "Créez une carte de pointage pour la voir apparaître ici.",
  },
  completed: {
    title: "Aucune carte terminée",
    message: "Les cartes clôturées apparaîtront ici.",
  },
};

/**
 * Écran de la liste complète des cartes de pointage du membre.
 * @returns L'écran des cartes de pointage.
 */
export function SavingsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<ListFilter>("active");
  const savings = DEMO_SAVINGS.filter((item) => matchesFilter(item.state === "COMPLETED", filter));
  const emptyState = EMPTY_STATES[filter];

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={savings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ListHeader topInset={insets.top} filter={filter} onFilterChange={setFilter} />
        }
        stickyHeaderIndices={[0]}
        ListEmptyComponent={<EmptyState title={emptyState.title} message={emptyState.message} />}
        contentContainerClassName="grow gap-3 px-4 pb-6"
        renderItem={({ item, index }) => (
          <SavingsCard item={item} index={index} width={FULL_CARD_WIDTH} />
        )}
      />
    </View>
  );
}
