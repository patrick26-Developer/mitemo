import { router } from "expo-router";
import { View } from "react-native";

import { HorizontalCardList } from "../../../shared/components/horizontal-card-list";
import { SectionTitle } from "../../../shared/components/section-title";
import { TontineCard } from "../../tontines";
import { HOME_TONTINES, formatCountLabel } from "../model/home-content";

/**
 * Affiche le titre et la liste horizontale des tontines du membre.
 * @returns La section des tontines.
 */
export function TontinesSection() {
  return (
    <View className="-mt-[276px] mb-5 flex-col gap-3">
      <SectionTitle
        label={formatCountLabel(HOME_TONTINES.length, "Tontine", "Tontines")}
        tone="light"
        onPress={() => router.push("/tontines")}
      />
      <HorizontalCardList
        items={HOME_TONTINES}
        keyOf={(item) => item.id}
        renderItem={(item, index) => <TontineCard item={item} index={index} />}
      />
    </View>
  );
}
