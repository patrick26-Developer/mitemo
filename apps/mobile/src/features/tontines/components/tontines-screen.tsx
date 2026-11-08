import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "../../../shared/components/screen-header";
import { DEMO_TONTINES } from "../../../shared/demo/tontines";
import { TontineCard } from "./tontine-card";

/**
 * Écran de la liste complète des tontines du membre.
 * @returns L'écran des tontines.
 */
export function TontinesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <ScreenHeader title="Mes tontines" subtitle={`${DEMO_TONTINES.length} tontines en cours`} />
      <FlatList
        data={DEMO_TONTINES}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="items-center gap-3 pb-6"
        renderItem={({ item, index }) => <TontineCard item={item} index={index} />}
      />
    </View>
  );
}
