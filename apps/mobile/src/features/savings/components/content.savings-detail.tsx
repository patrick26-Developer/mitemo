import { ScrollView, Text, View } from "react-native";

import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import { DetailRow } from "../../../shared/components/atoms/row.detail";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { remainingMarkers, remainingToSave } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { useSavingsActions } from "../hooks/hook.savings-actions";
import { SavingsSummaryCard } from "./card.savings-summary";
import { SavingsActionsPanel } from "./panel.savings-actions";

/** Props du contenu d'une carte trouvée. */
export interface SavingsDetailContentProps {
  readonly item: SavingsCard;
}

/**
 * Affiche la synthèse, les échéances, les marqueurs restants et les actions
 * d'une carte de pointage.
 * @param props Carte à afficher.
 * @returns Le contenu détaillé de la carte.
 */
export function SavingsDetailContent(props: SavingsDetailContentProps) {
  const { item } = props;
  const actions = useSavingsActions(item);
  const tontine = usePortfolioStore((state) =>
    state.tontines.find((entry) => entry.id === item.tontineId),
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-5 px-4 pb-8">
      <SavingsSummaryCard item={item} />
      {actions.feedback === null ? null : (
        <FeedbackBanner kind={actions.feedback.kind} message={actions.feedback.message} />
      )}
      <View className="gap-3 rounded-[18px] border border-card-border p-4">
        <DetailRow label="Échéance" value={formatLongDate(item.deadline)} />
        <DetailRow
          label="Marqueurs restants"
          value={`${remainingMarkers(item)} sur ${item.markersTotal}`}
        />
        <DetailRow label="Reste à épargner" value={`${formatAmount(remainingToSave(item))} FCFA`} />
        {tontine === undefined ? null : (
          <DetailRow label="Tontine rattachée" value={tontine.name} />
        )}
      </View>
      <SavingsActionsPanel
        item={item}
        onContribute={actions.contribute}
        onWithdraw={actions.withdraw}
        onTransfer={actions.transfer}
      />
      <Text className="text-[14px] leading-6 text-muted">{item.description}</Text>
    </ScrollView>
  );
}
