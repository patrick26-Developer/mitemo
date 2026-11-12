import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useSignInForm } from "../hooks/hook.sign-in-form";
import { AUTH_ENTRANCE_DELAY, AUTH_ENTRANCE_DURATION } from "../model/model.auth-theme";
import { AuthErrorText } from "./text.auth-error";
import { AuthFooterLink } from "./link.auth-footer";
import { AuthHeading } from "./heading.auth";
import { AuthLayout } from "./layout.auth";
import { AuthPrimaryButton } from "./button.auth-primary";
import { PhoneField } from "./field.phone";

/**
 * Première étape de connexion : saisie du numéro de téléphone.
 * @returns L'écran de connexion.
 */
export function SignInScreen() {
  const { digits, setDigits, valid, invalid, error, submit } = useSignInForm();

  return (
    <AuthLayout>
      <AuthHeading
        title="Bon retour !"
        subtitle="Connectez-vous pour accéder à votre super application financière."
      />
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.body).duration(AUTH_ENTRANCE_DURATION)}
      >
        <PhoneField digits={digits} onChange={setDigits} invalid={invalid} />
        <AuthErrorText message={error} />
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.action).duration(AUTH_ENTRANCE_DURATION)}
      >
        <AuthPrimaryButton label="Se connecter" onPress={submit} disabled={!valid} />
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.footer).duration(AUTH_ENTRANCE_DURATION)}
      >
        <AuthFooterLink
          prompt="Je n'ai pas de compte ?"
          label="Créer un compte"
          onPress={() => router.push("/(auth)/sign-up")}
        />
      </Animated.View>
    </AuthLayout>
  );
}
