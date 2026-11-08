import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import type { HomeSavings } from "../model/home-content";
import { CARD_WIDTH } from "../model/home-layout";
import { SavingsPanel } from "./savings-panel";

/** Props de la carte de caisse. */
export interface SavingsCardProps {
  readonly item: HomeSavings;
  /** Rang de la carte dans la liste, pour décaler l'apparition. */
  readonly index: number;
}

/**
 * Affiche une caisse d'épargne et son avancement vers l'objectif.
 * @param props Caisse à afficher et rang dans la liste.
 * @returns La carte de caisse.
 */
export function SavingsCard(props: SavingsCardProps) {
  const { item, index } = props;

  return (
    <Animated.View entering={FadeInRight.delay(200 + index * 120).duration(500)}>
      <Pressable
        onPress={() => router.push(`/savings/${item.id}`)}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View
          className="rounded-[20px] p-0.5"
          style={{ width: CARD_WIDTH, backgroundColor: item.tint }}
        >
          <Text className="px-4 py-4 text-[18px] font-medium text-ink" numberOfLines={1}>
            {item.title}
          </Text>
          <SavingsPanel item={item} />
        </View>
      </Pressable>
    </Animated.View>
  );
}
