import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AnimatedTabBar } from "../../shared/components/animated-tab-bar";

/**
 * Navigation par onglets.
 * @returns Les onglets et la barre d'état.
 */
export default function TabsLayout() {
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
