import { useCallback, useState } from "react";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { PIN_LENGTH } from "../model/model.auth-form";
import { usePinValidation } from "./hook.pin-validation";

/** Options de la saisie du PIN. */
export interface PinEntryOptions {
  /** Vérifie le code une fois les quatre chiffres saisis. */
  readonly verify: (pin: string) => Promise<boolean>;
  /** Appelé quand le code est accepté. */
  readonly onComplete: () => void;
  /** Message d'un code refusé ; « Code incorrect » par défaut. */
  readonly rejectedMessage?: string;
}

/**
 * Chiffres saisis et message d'erreur : chaque touche efface l'erreur.
 * @returns Le code, l'erreur et les actions du clavier.
 */
function usePinDigits() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const pressDigit = (digit: string) => {
    setError("");
    setPin((current) => (current.length < PIN_LENGTH ? current + digit : current));
  };
  const erase = () => {
    setError("");
    setPin((current) => current.slice(0, -1));
  };
  const reject = useCallback((message: string) => {
    setError(message);
    setPin("");
  }, []);

  return { pin, error, pressDigit, erase, reject };
}

/**
 * Gère la saisie d'un code PIN, sa vérification et l'animation d'erreur.
 * @param options Options de la saisie.
 * @param options.verify Vérifie le code une fois les quatre chiffres saisis.
 * @param options.onComplete Appelé quand le code est accepté.
 * @param options.rejectedMessage Message d'un code refusé.
 * @returns Le code, l'erreur, l'animation et les actions du clavier.
 */
export function usePinEntry({ verify, onComplete, rejectedMessage }: PinEntryOptions) {
  const { pin, error, pressDigit, erase, reject } = usePinDigits();
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));
  usePinValidation({
    pin,
    verify,
    onComplete,
    onError: reject,
    shake,
    ...(rejectedMessage === undefined ? {} : { rejectedMessage }),
  });

  return { pin, error, shakeStyle, pressDigit, erase };
}
