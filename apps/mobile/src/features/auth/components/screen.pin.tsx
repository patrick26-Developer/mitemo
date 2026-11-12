import { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

import { StepIndicator } from "../../../shared/components/atoms/indicator.step";
import { usePinEntry } from "../hooks/hook.pin-entry";
import type { PinChoicePhase } from "../hooks/hook.pin-choice";
import { usePinSession } from "../hooks/hook.pin-session";
import { SIGN_UP_STEPS } from "../model/model.auth-form";
import { AUTH_ENTRANCE_DELAY, AUTH_ENTRANCE_DURATION } from "../model/model.auth-theme";
import { AuthErrorText } from "./text.auth-error";
import { AuthHeading } from "./heading.auth";
import { AuthLayout } from "./layout.auth";
import { PinKeypad } from "./keypad.pin";
import { PinRow } from "./row.pin";
import { ForgotPinSheet } from "./sheet.forgot-pin";

/** Consigne de l'écran pour chaque étape du code. */
const PIN_SUBTITLES = {
  signIn: "Saisissez votre code à 4 chiffres pour accéder à vos tontines.",
  choose: "Choisissez un code à 4 chiffres pour sécuriser votre compte.",
  confirm: "Saisissez à nouveau votre code pour le confirmer.",
} as const;

/**
 * Choisit la consigne de l'écran selon le parcours et l'étape du code.
 * @param phase Étape du code à l'inscription, `null` à la connexion.
 * @returns La consigne affichée sous le titre.
 */
function pinSubtitle(phase: PinChoicePhase | null): string {
  return PIN_SUBTITLES[phase ?? "signIn"];
}

/** Props de la saisie du code et de son clavier. */
interface PinPadProps {
  readonly verify: (pin: string) => Promise<boolean>;
  readonly onComplete: () => void;
  readonly rejectedMessage: string | undefined;
  /** Ouvre l'aide « Code oublié », à la connexion seulement. */
  readonly onForgot: (() => void) | undefined;
}

/**
 * Cases du code, message d'erreur et clavier. Remontée à chaque étape du
 * code, pour repartir de cases vides.
 * @param props Vérification, réussite, message de refus et code oublié.
 * @returns La saisie du code.
 */
function PinPad(props: PinPadProps) {
  const { pin, error, shakeStyle, pressDigit, erase } = usePinEntry({
    verify: props.verify,
    onComplete: props.onComplete,
    ...(props.rejectedMessage === undefined ? {} : { rejectedMessage: props.rejectedMessage }),
  });

  return (
    <>
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
          {...(props.onForgot === undefined ? {} : { onForgot: props.onForgot })}
        />
      </Animated.View>
    </>
  );
}

/**
 * Affiche la saisie du PIN : à la connexion, ou à l'inscription en deux
 * saisies, le choix du code puis sa confirmation.
 * @returns L'écran du code PIN.
 */
export function PinScreen() {
  const session = usePinSession();
  const [forgotOpen, setForgotOpen] = useState(false);
  if (session.missingDraft) return null;

  return (
    <AuthLayout>
      <AuthHeading title="Code PIN" subtitle={pinSubtitle(session.phase)} onBack={session.back} />
      {session.isSignUp ? (
        <StepIndicator index={1} total={SIGN_UP_STEPS.length} title={SIGN_UP_STEPS[1]} />
      ) : null}
      <PinPad
        key={session.phase ?? "signIn"}
        verify={session.verify}
        onComplete={session.complete}
        rejectedMessage={session.rejectedMessage}
        onForgot={session.isSignUp ? undefined : () => setForgotOpen(true)}
      />
      <ForgotPinSheet visible={forgotOpen} onClose={() => setForgotOpen(false)} />
    </AuthLayout>
  );
}
