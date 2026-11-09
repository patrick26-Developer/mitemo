import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useSignUpForm } from "../hooks/use-sign-up-form";
import { AUTH_ENTRANCE_DELAY, AUTH_ENTRANCE_DURATION } from "../model/auth-theme";
import { AuthErrorText } from "./auth-error-text";
import { AuthFooterLink } from "./auth-footer-link";
import { AuthHeading } from "./auth-heading";
import { AuthLayout } from "./auth-layout";
import { AuthPrimaryButton } from "./auth-primary-button";
import { AuthTextField } from "./auth-text-field";
import { PhoneField } from "./phone-field";

/**
 * Première étape d'inscription : nom et numéro de téléphone.
 * @returns L'écran d'inscription.
 */
export function SignUpScreen() {
  const form = useSignUpForm();

  return (
    <AuthLayout>
      <AuthHeading
        title="Créer un compte"
        subtitle="Rejoignez vos tontines en quelques secondes."
        onBack={() => router.back()}
      />
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.body).duration(AUTH_ENTRANCE_DURATION)}
      >
        <AuthTextField
          placeholder="Précieuse"
          value={form.name}
          onChangeText={(value) => form.update("name", value)}
          accessibilityLabel="Nom complet"
        />
        <PhoneField digits={form.digits} onChange={(value) => form.update("digits", value)} />
        <AuthErrorText message={form.message} />
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.action).duration(AUTH_ENTRANCE_DURATION)}
      >
        <AuthPrimaryButton label="Continuer" onPress={form.submit} disabled={!form.validPhone} />
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.footer).duration(AUTH_ENTRANCE_DURATION)}
      >
        <AuthFooterLink
          prompt="Déjà un compte ?"
          label="Se connecter"
          onPress={() => router.replace("/(auth)/sign-in")}
        />
      </Animated.View>
    </AuthLayout>
  );
}
