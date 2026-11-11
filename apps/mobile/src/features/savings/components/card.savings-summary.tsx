import { Text, View } from "react-native";

import { MarkerProgress } from "../../../shared/components/atoms/markers.progress";
import { ProgressBar } from "../../../shared/components/atoms/bar.progress";
import { AmountText } from "../../../shared/components/atoms/text.amount";
import { formatAmount } from "../../../shared/format/format.amount";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import {
  cardGoal,
  cardProgress,
  markerFill,
  markersDone,
} from "../../../shared/member/model.portfolio";

/** Props de la carte de synthèse d'une carte de pointage. */
export interface SavingsSummaryCardProps {
  readonly item: SavingsCard;
}

/**
 * Affiche le montant épargné, l'objectif et les marqueurs validés d'une carte.
 * @param props Carte à résumer.
 * @returns La carte de synthèse.
 */
export function SavingsSummaryCard(props: SavingsSummaryCardProps) {
  const { item } = props;

  return (
    <View className="gap-3 rounded-[20px] p-5" style={{ backgroundColor: item.tint }}>
      <Text className="text-[14px] text-ink">Montant actuel</Text>
      <AmountText amount={item.saved} />
      <ProgressBar value={cardProgress(item)} />
      <MarkerProgress
        done={markersDone(item)}
        total={item.markersTotal}
        partial={markerFill(item)}
      />
      <Text className="text-[13px] text-ink">Objectif {formatAmount(cardGoal(item))} FCFA</Text>
    </View>
  );
}
