import { Text, View } from "react-native";

import { cardHistory } from "../../../shared/member/model.card-history";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { pointedCount } from "../model/model.card-history-count";
import { CardHistoryItem } from "./item.card-history";

/** Props de l'historique des pointages d'une carte. */
export interface CardHistoryListProps {
  readonly item: SavingsCard;
}

/**
 * Affiche la carte complète : tous ses pointages, un par ligne, ceux qui sont faits,
 * cochés avec leur jour, leur heure et leur montant, puis ceux qui restent à
 * faire.
 * @param props Carte dont on affiche l'historique.
 * @returns L'historique des pointages.
 */
export function CardHistoryList(props: CardHistoryListProps) {
  const rows = cardHistory(props.item);
  const done = props.item.entries.length;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between pb-1">
        <Text accessibilityRole="header" className="text-[16px] font-medium text-ink">
          Carte complète
        </Text>
        {rows.length === 0 ? null : (
          <Text className="text-[13px] text-muted">{pointedCount(done, rows.length)}</Text>
        )}
      </View>
      {rows.length === 0 ? (
        <Text className="text-[14px] text-muted">Aucun pointage prévu pour cette carte.</Text>
      ) : null}
      {rows.map((row) => (
        <CardHistoryItem key={row.position} row={row} accent={props.item.tint} />
      ))}
    </View>
  );
}
