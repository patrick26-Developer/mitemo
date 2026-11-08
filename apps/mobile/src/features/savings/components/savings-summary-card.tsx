import { Text, View } from "react-native";

import { ProgressBar } from "../../../shared/components/progress-bar";
import { formatAmount } from "../../../shared/format/format-amount";
import type { DemoSavings } from "../../../shared/demo/savings";
import { savingsProgress } from "../model/savings-progress";

/** Props de la carte de synthèse d'une caisse. */
export interface SavingsSummaryCardProps {
  readonly item: DemoSavings;
}

/**
 * Affiche le montant épargné, l'objectif et la progression d'une caisse.
 * @param props Caisse à résumer.
 * @returns La carte de synthèse.
 */
export function SavingsSummaryCard(props: SavingsSummaryCardProps) {
  const { item } = props;

  return (
    <View className="gap-3 rounded-[20px] p-5" style={{ backgroundColor: item.tint }}>
      <Text className="text-[14px] text-ink">Montant actuel</Text>
      <Text className="text-[30px] font-medium text-ink">
        {formatAmount(item.current)} <Text className="text-[16px] font-normal">FCFA</Text>
      </Text>
      <ProgressBar value={savingsProgress(item.current, item.goal)} />
      <Text className="text-[13px] text-ink">Objectif {formatAmount(item.goal)} FCFA</Text>
    </View>
  );
}
