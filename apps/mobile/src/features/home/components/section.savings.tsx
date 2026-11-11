import { router } from "expo-router";
import { View } from "react-native";

import { SectionTitle } from "../../../shared/components/atoms/title.section";
import { HorizontalCardList } from "../../../shared/components/macros/list.horizontal-card";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { SavingsCard } from "../../savings";
import { formatCountLabel } from "../model/model.home-content";

/**
 * Affiche le titre et la liste horizontale des cartes de pointage actives.
 * @returns La section des cartes de pointage.
 */
export function SavingsSection() {
  const cards = usePortfolioStore((state) => state.cards);
  const active = cards.filter((item) => item.state === "ACTIVE");

  return (
    <View className="mt-4 flex-col gap-3">
      <SectionTitle
        label={formatCountLabel(active.length, "Carte de pointage", "Cartes de pointage")}
        onPress={() => router.push("/savings")}
      />
      <HorizontalCardList
        items={active}
        keyOf={(item) => item.id}
        renderItem={(item, index) => <SavingsCard item={item} index={index} />}
      />
    </View>
  );
}
