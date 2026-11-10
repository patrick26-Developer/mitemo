import { Stack } from "expo-router";

/** Première route du groupe, utilisée quand on ouvre l'authentification. */
export const unstable_settings = { anchor: "sign-in" };

/**
 * Pile des écrans d'authentification, sans en-tête natif.
 * @returns La pile de connexion et d'inscription.
 */
export default function AuthGroupLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />;
}
