import { useEffect } from "react";
import type { SharedValue } from "react-native-reanimated";
import { withSequence, withTiming } from "react-native-reanimated";

import { PIN_LENGTH } from "../model/auth-form";

/** Délai avant de vérifier un code complet, en millisecondes. */
const VERIFY_DELAY = 250;

/** Options de la vérification du PIN. */
interface PinValidationOptions {
  readonly pin: string;
  readonly validate: (pin: string) => boolean;
  readonly onComplete: () => void;
  readonly onError: () => void;
  readonly shake: SharedValue<number>;
}

/**
 * Anime la secousse d'un code refusé.
 * @param shake Valeur animée de la translation horizontale.
 */
function shakePin(shake: SharedValue<number>): void {
  shake.set(
    withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 80 }),
      withTiming(-8, { duration: 80 }),
      withTiming(0, { duration: 50 }),
    ),
  );
}

/**
 * Vérifie le code une fois les quatre chiffres saisis.
 * @param options Code courant, validation et réactions.
 */
export function usePinValidation(options: PinValidationOptions): void {
  const { pin, validate, onComplete, onError, shake } = options;

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    const timer = setTimeout(() => {
      if (validate(pin)) {
        onComplete();
        return;
      }

      onError();
      shakePin(shake);
    }, VERIFY_DELAY);

    return () => clearTimeout(timer);
  }, [pin, validate, onComplete, onError, shake]);
}
