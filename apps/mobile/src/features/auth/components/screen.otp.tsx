import { router } from "expo-router";
import { Text, TextInput } from "react-native";
import { useOtpSession } from "../hooks/hook.otp-session";
import { AuthLayout } from "./layout.auth";
import { AuthHeading } from "./heading.auth";
import { AuthPrimaryButton } from "./button.auth-primary";
import { AuthErrorText } from "./text.auth-error";

/**
 * Exige une saisie OTP distincte ; la démonstration est annoncée comme simulée.
 * @returns Le formulaire OTP ou un message invitant à recommencer.
 */
export function OtpScreen() {
  const state = useOtpSession();
  return (
    <AuthLayout>
      <AuthHeading
        title="Vérification OTP"
        subtitle="Saisissez les 6 chiffres du code."
        onBack={() => router.back()}
      />
      <Text>
        {state.challenge
          ? `Démonstration : OTP simulé ${state.challenge.simulatedOtp}`
          : "Défi absent. Recommencez la connexion."}
      </Text>
      <TextInput
        accessibilityLabel="Code OTP à 6 chiffres"
        keyboardType="number-pad"
        maxLength={6}
        value={state.otp}
        onChangeText={state.setOtp}
        autoComplete="one-time-code"
        className="rounded-xl border border-card-border p-4 text-xl"
      />
      <AuthErrorText message={state.error} />
      <AuthPrimaryButton
        label="Vérifier le code"
        onPress={state.submit}
        disabled={state.pending || state.otp.length !== 6 || !state.challenge}
      />
    </AuthLayout>
  );
}
