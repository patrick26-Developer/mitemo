import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import type { DimensionValue } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import type { DemoSavings } from "../../../shared/demo/savings";
import { CARD_WIDTH } from "../../../shared/theme/card-layout";
import { SavingsPanel } from "./savings-panel";

/** Props de la carte de caisse. */
export interface SavingsCardProps {
  readonly item: DemoSavings;
  /** Rang de la carte dans la liste, pour décaler l'apparition. */
  readonly index: number;
  /** Largeur de la carte ; largeur de la home par défaut. */
  readonly width?: DimensionValue;
}

/**
 * Affiche le contenu de la carte de caisse.
 * @param props Props du corps.
 * @param props.item Données de la caisse.
 * @returns Le contenu de la carte.
 */
function SavingsCardBody(props: { readonly item: DemoSavings }) {
  const { item } = props;

  return (
    <View className="rounded-[20px] p-0.5" style={{ backgroundColor: item.tint }}>
      <Text className="px-4 py-4 text-[18px] font-medium text-ink" numberOfLines={1}>
        {item.title}
      </Text>
      <SavingsPanel item={item} />
    </View>
  );
}

/**
 * Affiche une caisse d'épargne et son avancement vers l'objectif.
 * @param props Caisse à afficher, rang dans la liste et largeur.
 * @returns La carte de caisse.
 */
export function SavingsCard(props: SavingsCardProps) {
  const { item, index, width = CARD_WIDTH } = props;

  return (
    <Animated.View entering={FadeInRight.delay(200 + index * 120).duration(500)} style={{ width }}>
      <Pressable onPress={() => router.push(`/savings-detail/${item.id}`)}>
        <SavingsCardBody item={item} />
      </Pressable>
    </Animated.View>
  );
}
