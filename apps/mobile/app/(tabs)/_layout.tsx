import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AnimatedTabBar } from "../../src/shared/components/macros/bar.tab";

/**
 * Navigation par onglets.
 * @returns Les onglets et la barre d'état.
 */
export default function TabsLayout() {
  return (
    <>
      <StatusBar style="auto" />

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
