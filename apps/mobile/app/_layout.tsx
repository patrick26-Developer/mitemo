import "../global.css";

import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AnimatedTabBar } from "../src/shared/components/animated-tab-bar";

/**
 * Navigation racine : quatre onglets, sans en-tête natif.
 * @returns Les onglets et la barre d'état.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        tabBar={(props) => <AnimatedTabBar {...props} />}
        screenOptions={{ headerShown: false, animation: "shift" }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="tontines" />
        <Tabs.Screen name="savings" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
