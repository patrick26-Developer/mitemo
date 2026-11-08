import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { ProgressBar } from "../../../shared/components/progress-bar";
import { formatAmount } from "../../../shared/format/format-amount";
import { PALETTE } from "../../../shared/theme/palette";
import type { DemoSavings } from "../../../shared/demo/savings";
import { savingsProgress } from "../model/savings-progress";

/** Props d'une caisse dans la liste complète. */
export interface SavingsListItemProps {
  readonly item: DemoSavings;
}

/**
 * Affiche une caisse avec son montant, son objectif et son échéance.
 * @param props Caisse à afficher.
 * @returns La ligne de caisse.
 */
export function SavingsListItem(props: SavingsListItemProps) {
  const { item } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      onPress={() => router.push(`/savings-detail/${item.id}`)}
      className="gap-3 rounded-[20px] border border-card-border bg-white p-4"
    >
      <View className="flex-row items-center gap-2">
        <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.tint }} />
        <Text className="flex-1 text-[18px] font-medium text-ink" numberOfLines={1}>
          {item.title}
        </Text>
        <ChevronRight size={18} color={PALETTE.muted} />
      </View>

      <View className="flex-row items-end justify-between gap-3">
        <Text className="text-[22px] font-medium text-ink">
          {formatAmount(item.current)}{" "}
          <Text className="text-[13px] font-normal text-muted">FCFA</Text>
        </Text>
        <Text className="text-[13px] text-muted">Objectif {formatAmount(item.goal)} FCFA</Text>
      </View>

      <ProgressBar value={savingsProgress(item.current, item.goal)} />

      <Text className="text-[12px] text-muted">Jusqu&apos;au {item.until}</Text>
    </Pressable>
  );
}
