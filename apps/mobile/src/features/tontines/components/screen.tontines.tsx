import { useState } from "react";

import { FilterableList } from "../../../shared/components/macros/list.filterable";
import type { FilterableListConfig } from "../../../shared/components/macros/list.filterable";
import type { DemoTontine } from "../../../shared/demo/demo.tontines";
import { DEMO_TONTINES } from "../../../shared/demo/demo.tontines";
import type { EmptyStateContent } from "../../../shared/model/model.list-empty-state";
import type { ListFilter } from "../../../shared/model/model.list-filter";
import { FULL_CARD_WIDTH } from "../../../shared/theme/theme.card-layout";
import { TontineAddSheet } from "./sheet.tontine-add";
import { TontineCard } from "./card.tontine";

/** Message affiché quand le filtre ne retient aucune tontine. */
const EMPTY_STATES: Readonly<Record<ListFilter, EmptyStateContent>> = {
  active: {
    title: "Aucune tontine active",
    message: "Rejoignez une tontine pour la voir apparaître ici.",
  },
  completed: {
    title: "Aucune tontine terminée",
    message: "Les tontines clôturées apparaîtront ici.",
  },
};

/** Réglages de la liste des tontines. */
const TONTINE_LIST: FilterableListConfig<DemoTontine> = {
  items: DEMO_TONTINES,
  keyOf: (item) => item.id,
  labelOf: (item) => item.name,
  isCompleted: (item) => item.state === "COMPLETED",
  searchPlaceholder: "Rechercher une tontine",
  searchSubject: "tontine",
  emptyStates: EMPTY_STATES,
  renderItem: (item, index) => <TontineCard item={item} index={index} width={FULL_CARD_WIDTH} />,
};

/**
 * Écran de la liste complète des tontines du membre.
 * @returns L'écran des tontines.
 */
export function TontinesScreen() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <FilterableList config={TONTINE_LIST} onAdd={() => setAddOpen(true)} />
      <TontineAddSheet visible={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
