import { FlatList, View } from "react-native";

import { SectionTitle } from "../../../shared/components/section-title";
import { HOME_TONTINES } from "../model/home-content";
import { CARD_GAP, CARD_WIDTH } from "../model/home-layout";
import { TontineCard } from "./tontine-card";

/**
 * Affiche le titre et la liste horizontale des tontines du membre.
 * @returns La section des tontines.
 */
export function TontinesSection() {
  return (
    <View className="-mt-[276px] mb-5 flex-col gap-3">
      <SectionTitle label="Mes Tontines" tone="light" />
      <FlatList
        data={HOME_TONTINES}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerClassName="gap-3 px-4"
        renderItem={({ item, index }) => <TontineCard item={item} index={index} />}
      />
    </View>
  );
}
