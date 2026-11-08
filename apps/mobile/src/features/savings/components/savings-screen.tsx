import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "../../../shared/components/screen-header";
import { DEMO_SAVINGS } from "../../../shared/demo/savings";
import { FULL_CARD_WIDTH } from "../../../shared/theme/card-layout";
import { SavingsCard } from "./savings-card";

/**
 * Écran de la liste complète des cartes de pointage du membre.
 * @returns L'écran des cartes de pointage.
 */
export function SavingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <ScreenHeader
        title="Mes cartes de pointage"
        subtitle={`${DEMO_SAVINGS.length} cartes de pointage`}
      />
      <FlatList
        data={DEMO_SAVINGS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4 pb-6"
        renderItem={({ item, index }) => (
          <SavingsCard item={item} index={index} width={FULL_CARD_WIDTH} />
        )}
      />
    </View>
  );
}
