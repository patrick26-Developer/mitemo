import { Tabs } from "expo-router";

import { AnimatedTabBar } from "../../src/shared/components/macros/bar.tab";

/**
 * Navigation par onglets. La barre d'état est portée par les écrans : chaque
 * onglet choisit la couleur d'icônes qui convient à son fond.
 * @returns Les onglets.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false, animation: "shift" }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="savings" />
      <Tabs.Screen name="tontines" />
    </Tabs>
  );
}
