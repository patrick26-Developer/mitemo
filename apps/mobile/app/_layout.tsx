import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

/**
 * Navigation racine : onglets avec pile pour les écrans de détail.
 * @returns La pile de navigation et la barre d'état.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="savings-detail/[id]" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tontine/[id]" />
      </Stack>
    </>
  );
}
