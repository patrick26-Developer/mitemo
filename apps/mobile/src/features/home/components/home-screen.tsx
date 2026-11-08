import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HatchPattern } from "../../../shared/components/hatch-pattern";
import { HomeHero } from "./home-hero";
import { SavingsSection } from "./savings-section";
import { TontinesSection } from "./tontines-section";

/**
 * Écran d'accueil : solde du membre, tontines et caisses en cours.
 * @returns L'écran d'accueil.
 */
export function HomeScreen() {
  const insets = useSafeAreaInsets();

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
    </View>
  );
}
