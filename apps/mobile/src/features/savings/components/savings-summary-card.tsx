import { Text, View } from "react-native";

import { AmountText } from "../../../shared/components/amount-text";
import { ProgressBar } from "../../../shared/components/progress-bar";
import { formatAmount } from "../../../shared/format/format-amount";
import type { DemoSavings } from "../../../shared/demo/savings";
import { savingsProgress } from "../model/savings-progress";

/** Props de la carte de synthèse d'une carte de pointage. */
export interface SavingsSummaryCardProps {
  readonly item: DemoSavings;
}

/**
 * Affiche le montant épargné, l'objectif et la progression d'une carte.
 * @param props Carte à résumer.
 * @returns La carte de synthèse.
 */
export function SavingsSummaryCard(props: SavingsSummaryCardProps) {
  const { item } = props;

  return (
    <View className="gap-3 rounded-[20px] p-5" style={{ backgroundColor: item.tint }}>
      <Text className="text-[14px] text-ink">Montant actuel</Text>
      <AmountText amount={item.current} />
      <ProgressBar value={savingsProgress(item.current, item.goal)} />
      <Text className="text-[13px] text-ink">Objectif {formatAmount(item.goal)} FCFA</Text>
    </View>
  );
}
