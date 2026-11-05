import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

/**
 * Navigation racine de l'application.
 * @returns La pile d'écrans et la barre d'état.
 */
export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}
