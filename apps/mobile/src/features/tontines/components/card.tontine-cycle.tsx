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
  if (item.state === "PENDING") {
    return (
      <View className="gap-3 rounded-[18px] border border-card-border p-4">
        <Text className="text-[16px] font-medium text-ink">En préparation</Text>
        <Text className="text-[13px] leading-5 text-muted">
          La tontine démarre quand tous les membres sont réunis : {item.members.length} sur{" "}
          {item.totalRounds} pour l&apos;instant.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3 rounded-[18px] border border-card-border p-4">
      <Text className="text-[16px] font-medium text-ink">Cycle en cours</Text>
      <ProgressBar value={item.round / item.totalRounds} />
      <DetailRow label="Tour actuel" value={`${item.round} sur ${item.totalRounds}`} />
      <DetailRow label="Bénéficiaire" value={beneficiaryName(item)} />
    </View>
  );
}
