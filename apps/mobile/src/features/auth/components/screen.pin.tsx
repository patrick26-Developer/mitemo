import { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

import { StepIndicator } from "../../../shared/components/atoms/indicator.step";
import { usePinEntry } from "../hooks/hook.pin-entry";
import { usePinSession } from "../hooks/hook.pin-session";
import { SIGN_UP_STEPS } from "../model/model.auth-form";
import { AUTH_ENTRANCE_DELAY, AUTH_ENTRANCE_DURATION } from "../model/model.auth-theme";
import { AuthErrorText } from "./text.auth-error";
import { AuthHeading } from "./heading.auth";
import { AuthLayout } from "./layout.auth";
import { PinKeypad } from "./keypad.pin";
import { PinRow } from "./row.pin";
import { ForgotPinSheet } from "./sheet.forgot-pin";

/**
 * Choisit la consigne de l'écran selon le parcours.
 * @param isSignUp Vrai à la création du code.
 * @returns La consigne affichée sous le titre.
 */
function pinSubtitle(isSignUp: boolean): string {
  return isSignUp
    ? "Choisissez un code à 4 chiffres pour sécuriser votre compte."
    : "Saisissez votre code à 4 chiffres pour accéder à vos tontines.";
}

/**
 * Affiche la saisie du PIN, à la connexion comme à la création du code.
 * @returns L'écran du code PIN.
 */
export function PinScreen() {
  const { isSignUp, verify, complete, back, missingDraft } = usePinSession();
  const { pin, error, shakeStyle, pressDigit, erase } = usePinEntry({
    verify,
    onComplete: complete,
  });

  const [forgotOpen, setForgotOpen] = useState(false);

  if (missingDraft) return null;

  return (
    <AuthLayout>
      <AuthHeading title="Code PIN" subtitle={pinSubtitle(isSignUp)} onBack={back} />
      {isSignUp ? (
        <StepIndicator index={1} total={SIGN_UP_STEPS.length} title={SIGN_UP_STEPS[1]} />
      ) : null}
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.body).duration(AUTH_ENTRANCE_DURATION)}
      >
        <Animated.View style={shakeStyle}>
          <PinRow pin={pin} />
        </Animated.View>
      </Animated.View>
      <AuthErrorText message={error} />
      <Animated.View
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.action).duration(AUTH_ENTRANCE_DURATION)}
      >
        <PinKeypad
          onPressDigit={pressDigit}
          onErase={erase}
          {...(isSignUp ? {} : { onForgot: () => setForgotOpen(true) })}
        />
      </Animated.View>
      <ForgotPinSheet visible={forgotOpen} onClose={() => setForgotOpen(false)} />
    </AuthLayout>
  );
}
