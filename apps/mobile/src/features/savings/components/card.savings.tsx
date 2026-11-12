import { router } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { NoisePattern } from "../../../shared/components/atoms/pattern.noise";
import { PressableScale } from "../../../shared/components/atoms/scale.pressable";
import type { SavingsCard as SavingsCardModel } from "../../../shared/member/model.portfolio";
import { CARD_WIDTH } from "../../../shared/theme/theme.card-layout";
import { SavingsPanel } from "./panel.savings";

/** Props de la carte de pointage. */
export interface SavingsCardProps {
  readonly item: SavingsCardModel;
  /** Rang de la carte dans la liste, pour décaler l'apparition. */
  readonly index: number;
  /** Largeur totale de la carte, en points ; largeur de la home par défaut. */
  readonly width?: number;
}

/** Props du corps d'une carte de pointage. */
interface SavingsCardBodyProps {
  readonly item: SavingsCardModel;
}

/**
 * Affiche le contenu de la carte de pointage.
 * @param props Carte à afficher.
 * @returns Le contenu de la carte.
 */
function SavingsCardBody(props: SavingsCardBodyProps) {
  const { item } = props;

  return (
    <View className="overflow-hidden rounded-[20px] p-0.5" style={{ backgroundColor: item.tint }}>
      <NoisePattern />
      <Text className="px-4 py-4 text-[18px] font-medium text-ink" numberOfLines={1}>
        {item.name}
      </Text>
      <SavingsPanel item={item} />
    </View>
  );
}

/**
 * Affiche une carte de pointage et son avancement vers l'objectif.
 * @param props Carte à afficher, rang dans la liste et largeur.
 * @returns La carte de pointage.
 */
export function SavingsCard(props: SavingsCardProps) {
  const { item, index, width = CARD_WIDTH } = props;

  return (
    <Animated.View entering={FadeInRight.delay(200 + index * 120).duration(500)} style={{ width }}>
      <PressableScale
        accessibilityLabel={`Ouvrir ${item.name}`}
        onPress={() => router.push(`/savings-detail/${item.id}`)}
      >
        <SavingsCardBody item={item} />
      </PressableScale>
    </Animated.View>
  );
}
