import { Text, View } from "react-native";

import { ProgressBar } from "../../../shared/components/atoms/bar.progress";
import { DetailRow } from "../../../shared/components/atoms/row.detail";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { beneficiaryName } from "../../../shared/member/model.portfolio";

/** Props de la carte d'avancement d'une tontine. */
export interface TontineCycleCardProps {
  readonly item: Tontine;
}

/**
 * Affiche l'avancement du cycle et le bénéficiaire du tour en cours.
 * @param props Tontine à détailler.
 * @returns La carte du cycle.
 */
export function TontineCycleCard(props: TontineCycleCardProps) {
  const { item } = props;

  return (
    <View className="gap-3 rounded-[18px] border border-card-border p-4">
      <Text className="text-[16px] font-medium text-ink">Cycle en cours</Text>
      <ProgressBar value={item.round / item.totalRounds} />
      <DetailRow label="Tour actuel" value={`${item.round} sur ${item.totalRounds}`} />
      <DetailRow label="Bénéficiaire" value={beneficiaryName(item)} />
    </View>
  );
}
