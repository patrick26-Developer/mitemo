import { useState } from "react";

import { FilterableList } from "../../../shared/components/macros/list.filterable";
import type { FilterableListConfig } from "../../../shared/components/macros/list.filterable";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { EmptyStateContent } from "../../../shared/model/model.list-empty-state";
import type { ListFilter } from "../../../shared/model/model.list-filter";
import { FULL_CARD_WIDTH } from "../../../shared/theme/theme.card-layout";
import { TAB_ICONS } from "../../../shared/theme/theme.tab-icons";
import { useInvitationReply } from "../hooks/hook.invitation-reply";
import { InvitationsBanner } from "./banner.invitations";
import { TontineCard } from "./card.tontine";
import { InvitationsSheet } from "./sheet.invitations";
import { TontineCreateSheet } from "./sheet.tontine-create";

/** Message affiché quand le filtre ne retient aucune tontine. */
const EMPTY_STATES: Readonly<Record<ListFilter, EmptyStateContent>> = {
  active: {
    title: "Aucune tontine active",
    message: "Créez une tontine pour la voir apparaître ici.",
  },
  completed: {
    title: "Aucune tontine terminée",
    message: "Les tontines dont tous les tours sont passés apparaîtront ici.",
  },
};

/** Réglages de la liste, sans les tontines qui viennent du portefeuille. */
const TONTINE_LIST: Omit<FilterableListConfig<Tontine>, "items"> = {
  keyOf: (item) => item.id,
  labelOf: (item) => item.name,
  isCompleted: (item) => item.state === "COMPLETED",
  searchPlaceholder: "Rechercher une tontine",
  searchSubject: "tontine",
  emptyStates: EMPTY_STATES,
  emptyIcon: TAB_ICONS.tontines,
  archivedLabel: "Terminées",
  renderItem: (item, index) => <TontineCard item={item} index={index} width={FULL_CARD_WIDTH} />,
};

/**
 * Écran de la liste complète des tontines du membre, avec en tête les
 * invitations reçues, à accepter ou refuser.
 * @returns L'écran des tontines.
 */
export function TontinesScreen() {
  const [addOpen, setAddOpen] = useState(false);
  const [invitationsOpen, setInvitationsOpen] = useState(false);
  const tontines = usePortfolioStore((state) => state.tontines);
  const reply = useInvitationReply();
  const count = reply.invitations.length;

  return (
    <>
      <FilterableList
        config={{ ...TONTINE_LIST, items: tontines }}
        onAdd={() => setAddOpen(true)}
        banner={<InvitationsBanner count={count} onPress={() => setInvitationsOpen(true)} />}
      />
      <TontineCreateSheet visible={addOpen} onClose={() => setAddOpen(false)} />
      <InvitationsSheet
        visible={invitationsOpen && (count > 0 || reply.choosing !== null)}
        reply={reply}
        onClose={() => setInvitationsOpen(false)}
      />
    </>
  );
}
