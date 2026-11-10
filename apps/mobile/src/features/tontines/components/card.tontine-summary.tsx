import { Text, View } from "react-native";

import { AmountText } from "../../../shared/components/atoms/text.amount";
import type { DemoTontine } from "../../../shared/demo/demo.tontines";

/** Props de la carte de synthèse d'une tontine. */
export interface TontineSummaryCardProps {
  readonly item: DemoTontine;
}

/**
 * Affiche la cotisation, la fréquence et le nombre de membres d'une tontine.
 * @param props Tontine à résumer.
 * @returns La carte de synthèse.
 */
export function TontineSummaryCard(props: TontineSummaryCardProps) {
  const { item } = props;

  return (
    <View className="gap-2 rounded-[20px] p-5" style={{ backgroundColor: item.headerColors[0] }}>
      <Text className="text-[14px] text-ink">Cotisation {item.frequency}</Text>
      <AmountText amount={item.amount} />
      <Text className="text-[14px] text-ink">{item.members} membres</Text>
    </View>
  );
}
