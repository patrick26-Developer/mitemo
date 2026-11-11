import { useState } from "react";
import { ScrollView, Text } from "react-native";

import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { isTontineAdmin } from "../../../shared/member/model.portfolio";
import { useTontineActions } from "../hooks/hook.tontine-actions";
import { TontineCycleCard } from "./card.tontine-cycle";
import { TontineSummaryCard } from "./card.tontine-summary";
import { TontineMemberList } from "./list.tontine-members";
import { TontineActionsPanel } from "./panel.tontine-actions";
import { TontineAdminPanel } from "./panel.tontine-admin";
import { TontineTransferSheet } from "./sheet.tontine-transfer";

/** Props du contenu d'une tontine trouvée. */
export interface TontineDetailContentProps {
  readonly item: Tontine;
}

/**
 * Affiche la synthèse, le cycle, les actions et les membres d'une tontine.
 * L'administrateur voit en plus le code d'invitation et le retrait des membres.
 * @param props Tontine à afficher.
 * @returns Le contenu détaillé de la tontine.
 */
export function TontineDetailContent(props: TontineDetailContentProps) {
  const { item } = props;
  const actions = useTontineActions(item);
  const [transferOpen, setTransferOpen] = useState(false);
  const admin = isTontineAdmin(item);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-5 px-4 pb-8">
      <TontineSummaryCard item={item} />
      <TontineCycleCard item={item} />
      {actions.feedback === null ? null : (
        <FeedbackBanner kind={actions.feedback.kind} message={actions.feedback.message} />
      )}
      <TontineActionsPanel
        item={item}
        onContribute={actions.contribute}
        onWithdraw={actions.withdraw}
        onTransfer={() => setTransferOpen(true)}
      />
      {admin ? <TontineAdminPanel item={item} onInvite={actions.invite} /> : null}
      <TontineMemberList item={item} onRemove={actions.remove} />
      <Text className="text-[14px] leading-6 text-muted">{item.description}</Text>
      <TontineTransferSheet
        visible={transferOpen}
        item={item}
        onClose={() => setTransferOpen(false)}
        onTransfer={actions.transfer}
      />
    </ScrollView>
  );
}
