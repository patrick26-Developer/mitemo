import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

import { ProfilePhotoSync } from "../src/features/profile";

/**
 * Navigation racine : onglets avec pile pour les écrans de détail.
 * @returns La pile de navigation et la barre d'état.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <ProfilePhotoSync />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="savings-detail/[id]" />
        <Stack.Screen name="tontine/[id]" />
        <Stack.Screen name="search" options={{ animation: "fade" }} />
        <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        <Stack.Screen name="history" options={{ animation: "slide_from_right" }} />
      </Stack>
    </>
  );
}
