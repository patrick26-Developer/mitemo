import { router } from "expo-router";
import { View } from "react-native";

import { HorizontalCardList } from "../../../shared/components/macros/list.horizontal-card";
import { SectionTitle } from "../../../shared/components/atoms/title.section";
import { SavingsCard } from "../../savings";
import { HOME_SAVINGS, formatCountLabel } from "../model/model.home-content";

/**
 * Affiche le titre et la liste horizontale des cartes de pointage.
 * @returns La section des cartes de pointage.
 */
export function SavingsSection() {
  return (
    <View className="mt-4 flex-col gap-3">
      <SectionTitle
        label={formatCountLabel(HOME_SAVINGS.length, "Carte de pointage", "Cartes de pointage")}
        onPress={() => router.push("/savings")}
      />
      <HorizontalCardList
        items={HOME_SAVINGS}
        keyOf={(item) => item.id}
        renderItem={(item, index) => <SavingsCard item={item} index={index} />}
      />
    </View>
  );
}
