import { router } from "expo-router";
import { Users } from "lucide-react-native";
import { Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { NoisePattern } from "../../../shared/components/atoms/pattern.noise";
import { PressableScale } from "../../../shared/components/atoms/scale.pressable";
import { BarcodeStrip } from "../../../shared/components/atoms/strip.barcode";
import { formatAmount } from "../../../shared/format/format.amount";
import { darkenColor } from "../../../shared/model/model.accent-color";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { beneficiaryName, formatFrequency } from "../../../shared/member/model.portfolio";
import { CARD_WIDTH, computeHeaderWidth } from "../../../shared/theme/theme.card-layout";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { RadialCard } from "./card.radial";
import { TontineRound } from "./round.tontine";

/** Props de la carte de tontine. */
export interface TontineCardProps {
  readonly item: Tontine;
  /** Rang de la carte dans la liste, pour décaler l'apparition. */
  readonly index: number;
  /** Largeur totale de la carte, en points ; largeur de la home par défaut. */
  readonly width?: number;
}

/** Props du corps d'une carte de tontine. */
interface TontineCardBodyProps {
  readonly item: Tontine;
  readonly headerWidth: number;
}

/**
 * Affiche le contenu de la carte de tontine.
 * @param props Tontine et largeur calculée du bandeau.
 * @returns Le contenu de la carte.
 */
function TontineCardBody(props: TontineCardBodyProps) {
  const { item, headerWidth } = props;

  return (
    <View className="flex-col gap-4 overflow-hidden rounded-[20px] border border-card-border bg-white/25 p-2">
      <NoisePattern />
      <TontineCardHeader item={item} headerWidth={headerWidth} />

      <View className="gap-6 px-4 pb-4 pt-1">
        <View className="flex-row items-center">
          <Users size={16} color={PALETTE.muted} />
          <Text className="ml-2 text-[16px] text-muted-strong">{item.members.length} membres</Text>
        </View>

        <View className="self-start rounded-[18px] border border-rule-border px-3 py-1.5">
          <Text className="text-[16px] text-ink">
            {formatAmount(item.contribution)} FCFA {formatFrequency(item.frequency)}
          </Text>
        </View>

        <TontineRound
          round={item.round}
          totalRounds={item.totalRounds}
          accent={item.headerColors[0]}
        />
        <BarcodeStrip color={PALETTE.barcodeOnCard} />

        <Text className="text-[13px] text-muted">
          Tour de <Text className="font-bold text-ink">{beneficiaryName(item)}</Text>
        </Text>
      </View>
    </View>
  );
}

/**
 * Bandeau du nom de la tontine, bordé d'une nuance à peine plus foncée que
 * le bord de son dégradé.
 * @param props Tontine et largeur calculée du bandeau.
 * @returns Le bandeau de la carte.
 */
function TontineCardHeader(props: TontineCardBodyProps) {
  const { item, headerWidth } = props;

  return (
    <View
      testID="tontine-card-header"
      className="overflow-hidden rounded-[14px] border"
      style={{ borderColor: darkenColor(item.headerColors[1]) }}
    >
      <RadialCard
        colors={item.headerColors}
        className="h-[84px] items-center justify-center px-3 py-2"
        width={headerWidth}
      >
        <Text className="text-[19px] font-medium text-ink" numberOfLines={1}>
          {item.name}
        </Text>
      </RadialCard>
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
      <PressableScale
        accessibilityLabel={`Ouvrir ${item.name}`}
        onPress={() => router.push(`/tontine/${item.id}`)}
      >
        <TontineCardBody item={item} headerWidth={computeHeaderWidth(width)} />
      </PressableScale>
    </Animated.View>
  );
}
