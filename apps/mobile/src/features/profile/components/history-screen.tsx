import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DetailHeader } from "../../../shared/components/detail-header";
import { DottedBackground } from "../../../shared/components/dotted-background";
import { PROFILE_HISTORY } from "../model/profile-history";
import { HistoryRow } from "./history-row";

/**
 * Écran de l'historique complet des opérations du membre.
 * @returns La page d'historique.
 */
export function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <DottedBackground />
      <DetailHeader title="Historique" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-4 px-4 pb-10">
        <Text className="text-[13px] font-medium uppercase text-muted">Dernières opérations</Text>
        <View className="gap-2">
          {PROFILE_HISTORY.map((entry) => (
            <HistoryRow key={entry.id} entry={entry} />
          ))}
        </View>
        <Text className="text-[13px] leading-5 text-muted">
          Les opérations sont classées de la plus récente à la plus ancienne. Chaque cotisation
          confirmée met à jour le tour de la tontine.
        </Text>
      </ScrollView>
    </View>
  );
}
