import { router } from "expo-router";
import { FlatList, View } from "react-native";

import { SectionTitle } from "../../../shared/components/section-title";
import { CARD_GAP, CARD_WIDTH } from "../../../shared/theme/card-layout";
import { SavingsCard } from "../../savings";
import { HOME_SAVINGS } from "../model/home-content";

/**
 * Affiche le titre et la liste horizontale des caisses d'épargne.
 * @returns La section des caisses.
 */
export function SavingsSection() {
  return (
    <View className="mt-4 flex-col gap-3">
      <SectionTitle label="Mes caisses" onPress={() => router.push("/savings")} />
      <FlatList
        data={HOME_SAVINGS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerClassName="gap-3 px-4"
        renderItem={({ item, index }) => <SavingsCard item={item} index={index} />}
      />
    </View>
  );
}
