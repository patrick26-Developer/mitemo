import { useState } from "react";

import { FilterableList } from "../../../shared/components/macros/list.filterable";
import type { FilterableListConfig } from "../../../shared/components/macros/list.filterable";
import type { DemoSavings } from "../../../shared/demo/demo.savings";
import { DEMO_SAVINGS } from "../../../shared/demo/demo.savings";
import type { EmptyStateContent } from "../../../shared/model/model.list-empty-state";
import type { ListFilter } from "../../../shared/model/model.list-filter";
import { FULL_CARD_WIDTH } from "../../../shared/theme/theme.card-layout";
import { SavingsAddSheet } from "./sheet.savings-add";
import { SavingsCard } from "./card.savings";

/** Message affiché quand le filtre ne retient aucune carte. */
const EMPTY_STATES: Readonly<Record<ListFilter, EmptyStateContent>> = {
  active: {
    title: "Aucune carte active",
    message: "Créez une carte de pointage pour la voir apparaître ici.",
  },
  completed: {
    title: "Aucune carte terminée",
    message: "Les cartes clôturées apparaîtront ici.",
  },
};

/** Réglages de la liste des cartes de pointage. */
const SAVINGS_LIST: FilterableListConfig<DemoSavings> = {
  items: DEMO_SAVINGS,
  keyOf: (item) => item.id,
  labelOf: (item) => item.title,
  isCompleted: (item) => item.state === "COMPLETED",
  searchPlaceholder: "Rechercher une carte",
  searchSubject: "carte",
  emptyStates: EMPTY_STATES,
  renderItem: (item, index) => <SavingsCard item={item} index={index} width={FULL_CARD_WIDTH} />,
};

/**
 * Écran de la liste complète des cartes de pointage du membre.
 * @returns L'écran des cartes de pointage.
 */
export function SavingsScreen() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <FilterableList config={SAVINGS_LIST} onAdd={() => setAddOpen(true)} />
      <SavingsAddSheet visible={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
