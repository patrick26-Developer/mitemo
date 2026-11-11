import { router } from "expo-router";
import { View } from "react-native";

import { SectionTitle } from "../../../shared/components/atoms/title.section";
import { HorizontalCardList } from "../../../shared/components/macros/list.horizontal-card";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { TontineCard } from "../../tontines";
import { formatCountLabel } from "../model/model.home-content";

/**
 * Affiche le titre et la liste horizontale des tontines actives du membre.
 * @returns La section des tontines.
 */
export function TontinesSection() {
  const tontines = usePortfolioStore((state) => state.tontines);
  const active = tontines.filter((item) => item.state === "ACTIVE");

  return (
    <View className="-mt-[276px] mb-5 flex-col gap-3">
      <SectionTitle
        label={formatCountLabel(active.length, "Tontine", "Tontines")}
        tone="light"
        onPress={() => router.push("/tontines")}
      />
      <HorizontalCardList
        items={active}
        keyOf={(item) => item.id}
        renderItem={(item, index) => <TontineCard item={item} index={index} />}
      />
    </View>
  );
}
