import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";

import { launchRoutes, SplashGate, useOnboardingStore } from "../src/features/onboarding";
import { useRestoreSession } from "../src/features/auth";
import { ToastHost } from "../src/shared/components/macros/host.toast";
import { useSessionStore } from "../src/shared/session/store.session";

/**
 * Attend la restauration serveur avant d'ouvrir le parcours OTP ou le compte.
 * Les routes locales non raccordées restent fermées pour ne pas afficher des
 * données de démonstration comme des données serveur.
 * Le fournisseur clavier d'Espoir est conservé pour les feuilles Android et iOS.
 * @returns La pile de navigation et la barre d'état.
 */
export default function RootLayout() {
  const ready = useRestoreSession();
  const signedIn = useSessionStore((state) => state.signedIn);
  const onboarded = useOnboardingStore((state) => state.completed);
  const routes = launchRoutes({ signedIn, onboarded });
  if (!ready) return <ActivityIndicator accessibilityLabel="Restauration de la session" />;

  return (
    <KeyboardProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected {...routes.member}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="history" options={{ animation: "slide_from_right" }} />
        </Stack.Protected>
        <Stack.Protected guard={false}>
          <Stack.Screen name="savings-detail/[id]" />
          <Stack.Screen name="tontine/[id]" />
          <Stack.Screen name="tontine-members/[id]" />
          <Stack.Screen name="invitation/[id]" />
          <Stack.Screen name="search" options={{ animation: "fade" }} />
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
