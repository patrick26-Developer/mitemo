import { router } from "expo-router";
import { Users } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import type { DimensionValue } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { BarcodeStrip } from "../../../shared/components/barcode-strip";
import { formatAmount } from "../../../shared/format/format-amount";
import type { DemoTontine } from "../../../shared/demo/tontines";
import { CARD_WIDTH } from "../../../shared/theme/card-layout";
import { PALETTE } from "../../../shared/theme/palette";
import { RadialCard } from "./radial-card";
import { TontineRound } from "./tontine-round";

/** Props de la carte de tontine. */
export interface TontineCardProps {
  readonly item: DemoTontine;
  /** Rang de la carte dans la liste, pour décaler l'apparition. */
  readonly index: number;
  /** Largeur de la carte ; largeur de la home par défaut. */
  readonly width?: DimensionValue;
}

/**
 * Affiche le contenu de la carte de tontine.
 * @param props Props du corps.
 * @param props.item Données de la tontine.
 * @returns Le contenu de la carte.
 */
function TontineCardBody(props: { readonly item: DemoTontine }) {
  const { item } = props;

  return (
    <View className="flex-col gap-4 overflow-hidden rounded-[20px] border border-card-border bg-white/25 p-2">
      <RadialCard
        colors={item.headerColors}
        className="h-[84px] items-center justify-center overflow-hidden rounded-[14px] border border-header-border px-3 py-2"
      >
        <Text className="text-[19px] font-medium text-ink" numberOfLines={1}>
          {item.name}
        </Text>
      </RadialCard>

      <View className="gap-6 px-4 pb-4 pt-1">
        <View className="flex-row items-center">
          <Users size={16} color={PALETTE.muted} />
          <Text className="ml-2 text-[16px] text-muted-strong">{item.members} membres</Text>
        </View>

        <View className="self-start rounded-[18px] border border-rule-border px-3 py-1.5">
          <Text className="text-[16px] text-ink">
            {formatAmount(item.amount)} FCFA {item.frequency}
          </Text>
        </View>

        <TontineRound round={item.round} totalRounds={item.totalRounds} />
        <BarcodeStrip color={PALETTE.barcodeOnCard} />

        <Text className="text-[13px] text-muted">
          Tour de <Text className="font-bold text-ink">{item.currentBeneficiary}</Text>
        </Text>
      </View>
    </View>
  );
}

/**
 * Affiche une tontine : règle du groupe et avancement du cycle.
 * @param props Tontine à afficher, rang dans la liste et largeur.
 * @returns La carte de tontine.
 */
export function TontineCard(props: TontineCardProps) {
  const { item, index, width = CARD_WIDTH } = props;

  return (
    <Animated.View entering={FadeInRight.delay(200 + index * 120).duration(500)} style={{ width }}>
      <Pressable onPress={() => router.push(`/tontine/${item.id}`)}>
        <TontineCardBody item={item} />
      </Pressable>
    </Animated.View>
  );
}
