import { useIsFocused } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HatchPattern } from "../../../shared/components/atoms/pattern.hatch";
import { HomeActions } from "./actions.home";
import { HomeHero } from "./hero.home";
import { NotificationsSheet } from "./sheet.notifications";
import { SavingsSection } from "./section.savings";
import { TontinesSection } from "./section.tontines";

/**
 * Écran d'accueil : solde du membre, tontines et cartes de pointage en cours.
 * Le bleu du bandeau est prolongé derrière la barre d'état, pour que l'effet
 * de bord du défilement ne blanchisse pas le haut de l'écran.
 * @returns L'écran d'accueil.
 */
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style={isFocused ? "light" : "dark"} />
      <View
        testID="home-status-bar-backdrop"
        pointerEvents="none"
        className="absolute inset-x-0 top-0 bg-brand"
        style={{ height: insets.top }}
      />
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
