import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";

import { launchRoutes, SplashGate, useOnboardingStore } from "../src/features/onboarding";
import { ProfilePhotoSync } from "../src/features/profile";
import { CardReminders } from "../src/features/savings";
import { AppBadgeSync } from "../src/shared/components/atoms/sync.app-badge";
import { ToastHost } from "../src/shared/components/macros/host.toast";
import { useSessionStore } from "../src/shared/session/store.session";

/**
 * Navigation racine : onglets avec pile pour les écrans de détail. Au premier
 * lancement, seule la présentation est accessible ; ensuite, sans session,
 * seule l'authentification l'est, et les écrans du membre ne s'ouvrent qu'une
 * fois la session ouverte par le code PIN. Ouvrir ou fermer la
 * session suffit donc à changer d'espace : le garde redirige de lui-même. Les
 * rappels de versement des cartes ne partent qu'une fois la session ouverte,
 * et l'icône de l'application porte le nombre de notifications non lues.
 * Les toasts de succès et d'erreur s'affichent par-dessus tous les écrans, et
 * l'écran de lancement par-dessus le tout, le temps de relire l'appareil. Le
 * fournisseur du clavier suit le clavier sur iOS comme sur Android, feuilles
 * comprises ; il garde l'application en plein écran sous les barres système,
 * sans quoi Android peignait une barre d'état blanche au-dessus du contenu.
 * @returns La pile de navigation et la barre d'état.
 */
export default function RootLayout() {
  const signedIn = useSessionStore((state) => state.signedIn);
  const onboarded = useOnboardingStore((state) => state.completed);
  const routes = launchRoutes({ signedIn, onboarded });

  return (
    <KeyboardProvider statusBarTranslucent navigationBarTranslucent preserveEdgeToEdge>
      <StatusBar style="dark" />
      <ProfilePhotoSync />
      <AppBadgeSync signedIn={signedIn} />
      {signedIn ? <CardReminders /> : null}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected {...routes.member}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="savings-detail/[id]" />
          <Stack.Screen name="tontine/[id]" />
          <Stack.Screen name="tontine-members/[id]" />
          <Stack.Screen name="invitation/[id]" />
          <Stack.Screen name="search" options={{ animation: "fade" }} />
          <Stack.Screen name="history" options={{ animation: "slide_from_right" }} />
        </Stack.Protected>
        <Stack.Protected {...routes.auth}>
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        </Stack.Protected>
        <Stack.Protected {...routes.onboarding}>
          <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
        </Stack.Protected>
      </Stack>
      <ToastHost />
      <SplashGate />
    </KeyboardProvider>
  );
}
