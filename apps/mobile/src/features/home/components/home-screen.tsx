import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HatchPattern } from "../../../shared/components/hatch-pattern";
import { HomeActions } from "./home-actions";
import { HomeHero } from "./home-hero";
import { NotificationsSheet } from "./notifications-sheet";
import { SavingsSection } from "./savings-section";
import { TontinesSection } from "./tontines-section";

/**
 * Écran d'accueil : solde du membre, tontines et cartes de pointage en cours.
 * @returns L'écran d'accueil.
 */
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeHero topInset={insets.top} />
        <TontinesSection />
        <HatchPattern />
        <SavingsSection />
        <View className="mt-5">
          <HatchPattern />
        </View>
      </ScrollView>
      <HomeActions topInset={insets.top} onOpenNotifications={() => setNotificationsOpen(true)} />
      <NotificationsSheet visible={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </View>
  );
}
