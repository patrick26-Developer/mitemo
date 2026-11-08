import { ScrollView, Text, View } from "react-native";

import { DetailRow } from "../../../shared/components/detail-row";
import { formatAmount } from "../../../shared/format/format-amount";
import type { DemoSavings } from "../../../shared/demo/savings";
import { SavingsSummaryCard } from "./savings-summary-card";

/** Props du contenu d'une carte trouvée. */
export interface SavingsDetailContentProps {
  readonly item: DemoSavings;
}

/**
 * Calcule le montant restant à épargner pour atteindre l'objectif.
 * @param item Carte concernée.
 * @returns Le reste à épargner, jamais négatif.
 */
function remainingToSave(item: DemoSavings): bigint {
  return item.goal > item.current ? item.goal - item.current : 0n;
}

/**
 * Affiche la synthèse, les échéances et la description d'une carte.
 * @param props Carte à afficher.
 * @returns Le contenu détaillé de la carte.
 */
export function SavingsDetailContent(props: SavingsDetailContentProps) {
  const { item } = props;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-5 px-4 pb-8">
      <SavingsSummaryCard item={item} />
      <View className="gap-3 rounded-[18px] border border-card-border p-4">
        <DetailRow label="Objectif" value={`${formatAmount(item.goal)} FCFA`} />
        <DetailRow label="Échéance" value={item.until} />
        <DetailRow label="Reste à épargner" value={`${formatAmount(remainingToSave(item))} FCFA`} />
      </View>
      <Text className="text-[14px] leading-6 text-muted">{item.description}</Text>
    </ScrollView>
  );
}
