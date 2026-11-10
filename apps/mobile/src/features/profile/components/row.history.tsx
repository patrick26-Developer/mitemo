import { Text, View } from "react-native";

import { formatAmount } from "../../../shared/format/format.amount";
import { formatDate } from "../../../shared/format/format.date";
import type { ProfileHistoryEntry } from "../model/model.profile-history";

/** Props d'une opération de l'historique. */
export interface HistoryRowProps {
  readonly entry: ProfileHistoryEntry;
}

/**
 * Affiche une opération de l'historique : libellé, date et montant signé.
 * @param props Opération à afficher.
 * @returns La ligne d'historique.
 */
export function HistoryRow(props: HistoryRowProps) {
  const { entry } = props;
  const isCredit = entry.direction === "credit";
  const sign = isCredit ? "+" : "-";
  const amountClassName = isCredit ? "text-avatar" : "text-danger";

  return (
    <View className="flex-row items-center justify-between gap-3 rounded-[14px] border border-card-border px-4 py-3">
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] text-ink">{entry.label}</Text>
        <Text className="text-[12px] text-muted">{formatDate(entry.date)}</Text>
      </View>
      <Text className={`text-[15px] font-semibold ${amountClassName}`}>
        {`${sign}${formatAmount(entry.amount)} FCFA`}
      </Text>
    </View>
  );
}
