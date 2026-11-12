import { Text, View } from "react-native";

import { CheckMark } from "../../../shared/components/atoms/mark.check";

import { formatAmount } from "../../../shared/format/format.amount";
import { formatDateTime } from "../../../shared/format/format.date";
import type { CardHistoryRow } from "../../../shared/member/model.card-history";
import { paymentMethodLabel } from "../../../shared/model/model.payment-method";

/** Props d'une carte de l'historique des pointages. */
export interface CardHistoryItemProps {
  readonly row: CardHistoryRow;
  /** Couleur d'action de l'écran : la teinte de la carte. */
  readonly accent: string;
}

/**
 * Affiche un pointage de la carte dans sa propre petite carte : coché, avec
 * son jour et son heure, puis son montant et, dessous, l'opérateur qui l'a
 * réglé quand il est fait ; vide, avec le montant prévu, tant qu'il est à
 * venir.
 * @param props Pointage à afficher et couleur d'action.
 * @returns La carte du pointage.
 */
export function CardHistoryItem(props: CardHistoryItemProps) {
  const { row, accent } = props;
  const when = row.at === null ? "À venir" : formatDateTime(row.at);
  const amount = `${formatAmount(row.amount)} FCFA`;
  const method = row.method === null ? null : paymentMethodLabel(row.method);

  return (
    <View
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked: row.done }}
      accessibilityLabel={[`Pointage ${row.position}`, amount, when, method]
        .filter(Boolean)
        .join(", ")}
      className="flex-row items-center gap-3 rounded-[16px] border border-card-border bg-white px-4 py-3.5"
    >
      <CheckMark done={row.done} accent={accent} />
      <View className="flex-1 gap-0.5">
        <Text className="text-[14px] font-medium text-ink">Pointage {row.position}</Text>
        <Text className="text-[12px] text-muted">{when}</Text>
      </View>
      <View className="items-end gap-0.5">
        <Text className={`text-[14px] font-semibold ${row.done ? "text-ink" : "text-muted"}`}>
          {amount}
        </Text>
        {method === null ? null : <Text className="text-[12px] text-muted">{method}</Text>}
      </View>
    </View>
  );
}
