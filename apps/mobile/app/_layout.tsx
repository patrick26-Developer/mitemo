import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

import { ProfilePhotoSync } from "../src/features/profile";
import { CardReminders } from "../src/features/savings";
import { ToastHost } from "../src/shared/components/macros/host.toast";
import { useSessionStore } from "../src/shared/session/store.session";

/**
 * Navigation racine : onglets avec pile pour les écrans de détail. Les écrans
 * du membre ne sont accessibles qu'une fois la session ouverte par le code PIN ;
 * sans session, seule l'authentification est accessible. Ouvrir ou fermer la
 * session suffit donc à changer d'espace : le garde redirige de lui-même. Les
 * rappels de versement des cartes ne partent qu'une fois la session ouverte.
 * Les toasts de succès et d'erreur s'affichent par-dessus tous les écrans.
 * @returns La pile de navigation et la barre d'état.
 */
export default function RootLayout() {
  const signedIn = useSessionStore((state) => state.signedIn);

  return (
    <>
      <StatusBar style="dark" />
      <ProfilePhotoSync />
      {signedIn ? <CardReminders /> : null}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={signedIn} redirectTo="/(auth)/sign-in">
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="savings-detail/[id]" />
          <Stack.Screen name="tontine/[id]" />
          <Stack.Screen name="tontine-members/[id]" />
          <Stack.Screen name="search" options={{ animation: "fade" }} />
          <Stack.Screen name="history" options={{ animation: "slide_from_right" }} />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn} redirectTo="/(tabs)">
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        </Stack.Protected>
      </Stack>
      <ToastHost />
    </>
  );
}
