import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AnimatedTabBar } from "../../src/shared/components/animated-tab-bar";

/**
 * Navigation par onglets.
 * @returns Les onglets et la barre d'état.
 */
export default function TabsLayout() {
  return (
    <>
      <StatusBar style="dark" />
      {/*
        Ordre imposé par Expo Router : `index` d'abord, puis les routes par
        longueur de nom, les égalités suivant l'ordre alphabétique des fichiers.
        Un autre ordre fait émettre un ROUTE_NAMES_CHANGED perdu au démarrage
        (expo/expo#52969). L'ordre d'affichage voulu est porté par
        AnimatedTabBar.
      */}
      <Tabs
        tabBar={(props) => <AnimatedTabBar {...props} />}
        screenOptions={{ headerShown: false, animation: "shift" }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="savings" />
        <Tabs.Screen name="tontines" />
      </Tabs>
    </>
  );
}
