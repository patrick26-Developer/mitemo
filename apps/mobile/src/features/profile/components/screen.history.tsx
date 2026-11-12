import { ScrollView, Text, View } from "react-native";

import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { PROFILE_HISTORY } from "../model/model.profile-history";
import { HistoryRow } from "./row.history";

/**
 * Écran de l'historique complet des opérations du membre.
 * @returns La page d'historique.
 */
export function HistoryScreen() {
  return (
    <ScreenFrame>
      <DetailHeader title="Historique" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 px-4 pt-5 pb-10"
      >
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
    </ScreenFrame>
  );
}
