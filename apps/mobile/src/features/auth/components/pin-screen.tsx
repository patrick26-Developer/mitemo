import { Alert } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { usePinEntry } from "../hooks/use-pin-entry";
import { usePinSession } from "../hooks/use-pin-session";
import { isValidDemoPin } from "../model/auth-form";
import { AUTH_ENTRANCE_DELAY, AUTH_ENTRANCE_DURATION } from "../model/auth-theme";
import { AuthErrorText } from "./auth-error-text";
import { AuthHeading } from "./auth-heading";
import { AuthLayout } from "./auth-layout";
import { PinDemoHint } from "./pin-demo-hint";
import { PinKeypad } from "./pin-keypad";
import { PinRow } from "./pin-row";

/**
 * Accepte n'importe quel code de quatre chiffres lors d'une inscription.
 * @returns Toujours vrai.
 */
function acceptPin(): boolean {
  return true;
}

/** Explique que la réinitialisation arrivera avec l'API. */
function showForgotPin(): void {
  Alert.alert("Code PIN oublié", "La réinitialisation par SMS sera disponible prochainement.");
}

/**
 * Affiche la saisie du PIN, à la connexion comme à la création du code.
 * @returns L'écran du code PIN.
 */
export function PinScreen() {
  const { isSignUp, complete, back, missingDraft } = usePinSession();
  const { pin, error, shakeStyle, pressDigit, erase } = usePinEntry({
    validate: isSignUp ? acceptPin : isValidDemoPin,
    onComplete: complete,
  });

  if (missingDraft) return null;

  const subtitle = isSignUp
    ? "Choisissez un code à 4 chiffres pour sécuriser votre compte."
    : "Saisissez votre code à 4 chiffres pour accéder à vos tontines.";

  return (
    <AuthLayout>
      <AuthHeading title="Code PIN" subtitle={subtitle} onBack={back} />
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
          {...(isSignUp ? {} : { onForgot: showForgotPin })}
        />
      </Animated.View>
      {isSignUp ? null : <PinDemoHint />}
    </AuthLayout>
  );
}
