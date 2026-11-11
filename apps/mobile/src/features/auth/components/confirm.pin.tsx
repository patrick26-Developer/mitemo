import { useCallback } from "react";
import Animated from "react-native-reanimated";

import { useMemberStore } from "../../../shared/member/store.member";
import { PIN_AUTH_DEPS } from "../api/deps.pin-auth";
import { usePinEntry } from "../hooks/hook.pin-entry";
import { checkPin } from "../model/model.pin-auth";
import { AuthErrorText } from "./text.auth-error";
import { PinKeypad } from "./keypad.pin";
import { PinRow } from "./row.pin";

/** Props du pavé de confirmation par code PIN. */
export interface PinConfirmProps {
  /** Appelé une fois le code du membre reconnu. */
  readonly onConfirmed: () => void;
}

/**
 * Demande le code PIN Mitemo pour valider une opération, par exemple un
 * paiement : le code est vérifié sur l'appareil, avec le numéro du membre.
 * @param props Action à mener une fois le code reconnu.
 * @returns Les cases, l'erreur éventuelle et le clavier du code.
 */
export function PinConfirm(props: PinConfirmProps) {
  const { onConfirmed } = props;
  const phone = useMemberStore((state) => state.phone);
  const verify = useCallback((pin: string) => checkPin({ phone, pin }, PIN_AUTH_DEPS), [phone]);
  const { pin, error, shakeStyle, pressDigit, erase } = usePinEntry({
    verify,
    onComplete: onConfirmed,
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
