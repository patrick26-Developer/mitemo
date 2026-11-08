import { router } from "expo-router";
import { ChevronRight, Users } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { ProgressBar } from "../../../shared/components/progress-bar";
import { formatAmount } from "../../../shared/format/format-amount";
import { PALETTE } from "../../../shared/theme/palette";
import type { DemoTontine } from "../../../shared/demo/tontines";

/** Props d'une tontine dans la liste complète. */
export interface TontineListItemProps {
  readonly item: DemoTontine;
}

/**
 * Affiche une tontine avec sa règle, son avancement et son bénéficiaire.
 * @param props Tontine à afficher.
 * @returns La ligne de tontine.
 */
export function TontineListItem(props: TontineListItemProps) {
  const { item } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.name}
      onPress={() => router.push(`/tontine/${item.id}`)}
      className="gap-3 rounded-[20px] border border-card-border bg-white p-4"
    >
      <View className="flex-row items-center gap-2">
        <Text className="flex-1 text-[18px] font-medium text-ink" numberOfLines={1}>
          {item.name}
        </Text>
        <ChevronRight size={18} color={PALETTE.muted} />
      </View>

      <View className="flex-row items-center gap-1.5">
        <Users size={15} color={PALETTE.muted} />
        <Text className="text-[14px] text-muted">{item.members} membres</Text>
      </View>

      <View className="flex-row items-center gap-2">
        <ProgressBar value={item.round / item.totalRounds} />
        <Text className="text-[12px] text-muted">
          Tour {item.round} / {item.totalRounds}
        </Text>
      </View>

      <Text className="text-[14px] text-ink">
        {formatAmount(item.amount)} FCFA {item.frequency}
      </Text>

      <Text className="text-[13px] text-muted">
        Tour de <Text className="font-bold text-ink">{item.currentBeneficiary}</Text>
      </Text>
    </Pressable>
  );
}
