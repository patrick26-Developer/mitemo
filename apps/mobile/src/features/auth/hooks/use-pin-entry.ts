import { useState } from "react";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { PIN_LENGTH } from "../model/auth-form";
import { usePinValidation } from "./use-pin-validation";

/** Options de la saisie du PIN. */
export interface PinEntryOptions {
  /** Vérifie le code une fois les quatre chiffres saisis. */
  readonly validate: (pin: string) => boolean;
  /** Appelé quand le code est accepté. */
  readonly onComplete: () => void;
}

/**
 * Gère la saisie d'un code PIN, sa vérification et l'animation d'erreur.
 * @param options Options de la saisie.
 * @param options.validate Vérifie le code une fois les quatre chiffres saisis.
 * @param options.onComplete Appelé quand le code est accepté.
 * @returns Le code, l'erreur, l'animation et les actions du clavier.
 */
export function usePinEntry({ validate, onComplete }: PinEntryOptions) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  const pressDigit = (digit: string) => {
    setError("");
    setPin((current) => (current.length < PIN_LENGTH ? current + digit : current));
  };
  const erase = () => {
    setError("");
    setPin((current) => current.slice(0, -1));
  };
  const reject = () => {
    setError("Code incorrect. Réessayez.");
    setPin("");
  };
  usePinValidation({ pin, validate, onComplete, onError: reject, shake });

  return { pin, error, shakeStyle, pressDigit, erase };
}
