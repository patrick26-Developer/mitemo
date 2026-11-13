import { useRef } from "react";
import Animated from "react-native-reanimated";

import type { PinChangeCheck } from "../hooks/hook.pin-change";
import { usePinEntry } from "../hooks/hook.pin-entry";
import { PinKeypad } from "./keypad.pin";
import { PinRow } from "./row.pin";
import { AuthErrorText } from "./text.auth-error";

/** Props d'une étape du changement de code. */
export interface PinChangeStepProps {
  readonly check: PinChangeCheck;
  /** Code accepté par la vérification de l'étape. */
  readonly onAccepted: (pin: string) => void;
}

/**
 * Saisie d'un code à quatre chiffres, vérifiée par l'étape ; un code refusé
 * fait trembler la ligne et affiche le message de l'étape.
 * @param props Vérification et code accepté.
 * @returns La ligne du code et le pavé.
 */
export function PinChangeStepEntry(props: PinChangeStepProps) {
  const { check, onAccepted } = props;
  const typed = useRef("");
  const { pin, error, shakeStyle, pressDigit, erase } = usePinEntry({
    verify: (value) => {
      typed.current = value;
      return check.verify(value);
    },
    onComplete: () => onAccepted(typed.current),
    rejectedMessage: check.rejectedMessage,
  });

  return (
    <>
      <Animated.View style={shakeStyle}>
        <PinRow pin={pin} />
      </Animated.View>
      <AuthErrorText message={error} />
      <PinKeypad onPressDigit={pressDigit} onErase={erase} />
    </>
  );
}
