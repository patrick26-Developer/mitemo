import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { StepIndicator } from "../../../shared/components/atoms/indicator.step";
import { useSignUpForm } from "../hooks/hook.sign-up-form";
import { SIGN_UP_STEPS } from "../model/model.auth-form";
import { AUTH_ENTRANCE_DELAY, AUTH_ENTRANCE_DURATION } from "../model/model.auth-theme";
import { AuthErrorText } from "./text.auth-error";
import { AuthFooterLink } from "./link.auth-footer";
import { AuthHeading } from "./heading.auth";
import { AuthLayout } from "./layout.auth";
import { AuthPrimaryButton } from "./button.auth-primary";
import { SignUpFields } from "./fields.sign-up";

/**
 * Première étape d'inscription : identité, profession et numéro de téléphone.
 * @returns L'écran d'inscription.
 */
export function SignUpScreen() {
  const form = useSignUpForm();

  return (
    <AuthLayout>
      <AuthHeading
        title="Créer un compte"
        subtitle="Rejoignez vos tontines en quelques secondes. Le reste de vos informations se complète dans votre profil."
        onBack={() => router.back()}
      />
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.body).duration(AUTH_ENTRANCE_DURATION)}
      >
        <StepIndicator index={0} total={SIGN_UP_STEPS.length} title={SIGN_UP_STEPS[0]} />
        <SignUpFields form={form} />
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
