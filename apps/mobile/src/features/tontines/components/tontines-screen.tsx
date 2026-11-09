import { useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "../../../shared/components/empty-state";
import { ListHeader } from "../../../shared/components/list-header";
import { DEMO_TONTINES } from "../../../shared/demo/tontines";
import { matchesFilter } from "../../../shared/model/list-filter";
import type { ListFilter } from "../../../shared/model/list-filter";
import { FULL_CARD_WIDTH } from "../../../shared/theme/card-layout";
import { TontineCard } from "./tontine-card";

/** Message affiché quand le filtre ne retient aucune tontine. */
const EMPTY_STATES: Readonly<Record<ListFilter, { title: string; message: string }>> = {
  active: {
    title: "Aucune tontine active",
    message: "Rejoignez une tontine pour la voir apparaître ici.",
  },
  completed: {
    title: "Aucune tontine terminée",
    message: "Les tontines clôturées apparaîtront ici.",
  },
};

/**
 * Écran de la liste complète des tontines du membre.
 * @returns L'écran des tontines.
 */
export function TontinesScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<ListFilter>("active");
  const tontines = DEMO_TONTINES.filter((item) =>
    matchesFilter(item.state === "COMPLETED", filter),
  );
  const emptyState = EMPTY_STATES[filter];

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <ListHeader filter={filter} onFilterChange={setFilter} />
      {tontines.length === 0 ? (
        <EmptyState title={emptyState.title} message={emptyState.message} />
      ) : (
        <FlatList
          data={tontines}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 px-4 pb-6"
          renderItem={({ item, index }) => (
            <TontineCard item={item} index={index} width={FULL_CARD_WIDTH} />
          )}
        />
      )}
    </View>
  );
}
