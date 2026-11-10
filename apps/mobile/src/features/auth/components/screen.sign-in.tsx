import { router } from "expo-router";
import { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useAuthDraft } from "../model/model.auth-draft";
import { PHONE_DIGITS, isValidPhoneDigits, toInternationalPhone } from "../model/model.auth-form";
import {
  AUTH_ENTRANCE_DELAY,
  AUTH_ENTRANCE_DURATION,
  AUTH_ICON_DELAY,
} from "../model/model.auth-theme";
import { AuthErrorText } from "./text.auth-error";
import { AuthFooterLink } from "./link.auth-footer";
import { AuthHeading } from "./heading.auth";
import { AuthLayout } from "./layout.auth";
import { AuthPrimaryButton } from "./button.auth-primary";
import { PhoneField } from "./field.phone";

/** Message affiché quand les neuf chiffres ne forment pas un numéro valide. */
const PHONE_ERROR = "Entrez un numéro congolais valide, par exemple 06 570 66 22.";

/**
 * Première étape de connexion : saisie du numéro de téléphone.
 * @returns L'écran de connexion.
 */
export function SignInScreen() {
  const [digits, setDigits] = useState("");
  const startSignIn = useAuthDraft((state) => state.startSignIn);
  const valid = isValidPhoneDigits(digits);
  const error = digits.length === PHONE_DIGITS && !valid ? PHONE_ERROR : "";

  const submit = () => {
    if (!valid) return;

    startSignIn(toInternationalPhone(digits));
    router.push("/(auth)/pin");
  };

  return (
    <AuthLayout>
      <AuthHeading
        title="Bon retour !"
        subtitle="Connectez-vous pour accéder à votre super application financière."
      />
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.body).duration(AUTH_ENTRANCE_DURATION)}
      >
        <PhoneField digits={digits} onChange={setDigits} iconDelay={AUTH_ICON_DELAY} />
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
