import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

/**
 * Navigation racine : onglets avec pile pour les écrans de détail.
 * @returns La pile de navigation et la barre d'état.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tontine/[id]" />
        <Stack.Screen name="caisse/[id]" />
      </Stack>
    </>
  );
}
