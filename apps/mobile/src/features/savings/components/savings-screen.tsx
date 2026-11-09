import { useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DottedBackground } from "../../../shared/components/dotted-background";
import { EmptyState } from "../../../shared/components/empty-state";
import { ListHeader } from "../../../shared/components/list-header";
import { DEMO_SAVINGS } from "../../../shared/demo/savings";
import { matchesFilter, matchesSearch } from "../../../shared/model/list-filter";
import type { ListFilter } from "../../../shared/model/list-filter";
import { FULL_CARD_WIDTH } from "../../../shared/theme/card-layout";
import { SavingsAddSheet } from "./savings-add-sheet";
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
 * Message d'état vide adapté au filtre et à la recherche en cours.
 * @param filter Filtre d'état sélectionné.
 * @param query Recherche saisie.
 * @returns Le titre et le message à afficher.
 */
function emptyStateFor(filter: ListFilter, query: string) {
  const trimmed = query.trim();

  if (trimmed === "") return EMPTY_STATES[filter];

  return {
    title: "Aucun résultat",
    message: `Aucune carte ne correspond à « ${trimmed} ».`,
  };
}

/**
 * Écran de la liste complète des cartes de pointage du membre.
 * @returns L'écran des cartes de pointage.
 */
export function SavingsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<ListFilter>("active");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const savings = DEMO_SAVINGS.filter(
    (item) => matchesFilter(item.state === "COMPLETED", filter) && matchesSearch(item.title, query),
  );

  return (
    <View className="flex-1 bg-white">
      <DottedBackground />
      <FlatList
        data={savings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <ListHeader
            topInset={insets.top}
            filter={filter}
            onFilterChange={setFilter}
            onAdd={() => setAddOpen(true)}
            search={{
              query,
              onChange: setQuery,
              placeholder: "Rechercher une carte",
            }}
          />
        }
        stickyHeaderIndices={[0]}
        ListEmptyComponent={<EmptyState {...emptyStateFor(filter, query)} />}
        contentContainerClassName="grow gap-3 px-4 pb-6"
        renderItem={({ item, index }) => (
          <SavingsCard item={item} index={index} width={FULL_CARD_WIDTH} />
        )}
      />
      <SavingsAddSheet visible={addOpen} onClose={() => setAddOpen(false)} />
    </View>
  );
}
