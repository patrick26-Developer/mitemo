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
 * Le défilement passe sous la barre d'état, qui reste transparente : le bleu
 * du bandeau monte jusqu'en haut sans bande fixe ajoutée par-dessus.
 * @returns L'écran d'accueil.
 */
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style={isFocused ? "light" : "dark"} />
      {/*
        iOS 26 floute le contenu qui passe sous la barre d'état : react-native-screens
        applique son effet de bord au premier ScrollView trouvé en descendant les
        premiers sous-enfants de l'écran. Cette vue vide, volontairement placée en
        premier, coupe cette recherche : aucun effet n'est appliqué et le bleu du
        bandeau reste net jusqu'en haut. Ne pas la déplacer ni la supprimer.
      */}
      <View testID="home-scroll-guard" style={{ height: 0 }} />
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
