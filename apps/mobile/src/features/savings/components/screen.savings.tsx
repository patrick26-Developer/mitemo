import { useState } from "react";

import { FilterableList } from "../../../shared/components/macros/list.filterable";
import type { FilterableListConfig } from "../../../shared/components/macros/list.filterable";
import type { SavingsCard as SavingsCardModel } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { EmptyStateContent } from "../../../shared/model/model.list-empty-state";
import type { ListFilter } from "../../../shared/model/model.list-filter";
import { FULL_CARD_WIDTH } from "../../../shared/theme/theme.card-layout";
import { SavingsCard } from "./card.savings";
import { SavingsCreateSheet } from "./sheet.savings-create";

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

/** Réglages de la liste, sans les cartes qui viennent du portefeuille. */
const SAVINGS_LIST: Omit<FilterableListConfig<SavingsCardModel>, "items"> = {
  keyOf: (item) => item.id,
  labelOf: (item) => item.name,
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
  const cards = usePortfolioStore((state) => state.cards);

  return (
    <>
      <FilterableList config={{ ...SAVINGS_LIST, items: cards }} onAdd={() => setAddOpen(true)} />
      <SavingsCreateSheet visible={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
