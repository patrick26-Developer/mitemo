import { View } from "react-native";

import { DetailRow } from "../../../shared/components/atoms/row.detail";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { remainingMarkers, remainingToSave } from "../../../shared/member/model.portfolio";

/** Props de la carte d'informations d'une carte de pointage. */
export interface SavingsFactsCardProps {
  readonly item: SavingsCard;
  /** Nom de la tontine rattachée, `null` quand la carte est indépendante. */
  readonly tontineName: string | null;
}

/**
 * Affiche l'échéance, les marqueurs restants et le reste à épargner d'une carte,
 * ainsi que la tontine qu'elle règle quand elle en a une.
 * @param props Carte à détailler et nom de sa tontine.
 * @returns La carte d'informations.
 */
export function SavingsFactsCard(props: SavingsFactsCardProps) {
  const { item, tontineName } = props;

  return (
    <View className="gap-3 rounded-[18px] border border-card-border p-4">
      <DetailRow label="Échéance" value={formatLongDate(item.deadline)} />
      <DetailRow
        label="Marqueurs restants"
        value={`${remainingMarkers(item)} sur ${item.markersTotal}`}
      />
      <DetailRow label="Reste à épargner" value={`${formatAmount(remainingToSave(item))} FCFA`} />
      {tontineName === null ? null : <DetailRow label="Tontine rattachée" value={tontineName} />}
    </View>
  );
}
