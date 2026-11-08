import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "../../../shared/components/screen-header";
import { DEMO_SAVINGS } from "../../../shared/demo/savings";
import { SavingsCard } from "./savings-card";

/**
 * Écran de la liste complète des caisses d'épargne du membre.
 * @returns L'écran des caisses.
 */
export function SavingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <ScreenHeader title="Mes caisses" subtitle={`${DEMO_SAVINGS.length} caisses d'épargne`} />
      <FlatList
        data={DEMO_SAVINGS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4 pb-6"
        renderItem={({ item, index }) => <SavingsCard item={item} index={index} width="100%" />}
      />
    </View>
  );
}
