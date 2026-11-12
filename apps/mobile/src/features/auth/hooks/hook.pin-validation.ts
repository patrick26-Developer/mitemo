import { useEffect } from "react";
import type { SharedValue } from "react-native-reanimated";
import { withSequence, withTiming } from "react-native-reanimated";

import { PIN_LENGTH } from "../model/model.auth-form";

/** Délai avant de vérifier un code complet, en millisecondes. */
const VERIFY_DELAY = 250;

/** Message d'un code refusé. */
export const PIN_REJECTED_MESSAGE = "Code incorrect. Réessayez.";

/** Message affiché quand la vérification elle-même échoue. */
export const PIN_UNAVAILABLE_MESSAGE = "Vérification impossible pour le moment. Réessayez.";

/** Options de la vérification du PIN. */
interface PinValidationOptions {
  readonly pin: string;
  readonly verify: (pin: string) => Promise<boolean>;
  readonly onComplete: () => void;
  readonly onError: (message: string) => void;
  readonly shake: SharedValue<number>;
  /** Message d'un code refusé ; « Code incorrect » par défaut. */
  readonly rejectedMessage?: string;
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

/** Réaction à un code refusé. */
interface PinRejection {
  readonly message: string;
  readonly onError: (message: string) => void;
  readonly shake: SharedValue<number>;
}

/**
 * Affiche le message du refus et secoue les cases.
 * @param rejection Message, affichage et animation.
 */
function rejectPin(rejection: PinRejection): void {
  rejection.onError(rejection.message);
  shakePin(rejection.shake);
}

/** Vérification à lancer, et réactions tant que la saisie n'a pas changé. */
interface PinVerification {
  readonly pin: string;
  readonly verify: (pin: string) => Promise<boolean>;
  readonly onAccept: () => void;
  readonly onReject: (message: string) => void;
  readonly rejectedMessage: string;
}

/**
 * Lance la vérification et transmet son issue : accepté, refusé ou impossible.
 * @param verification Code, vérification et réactions.
 */
function runVerification(verification: PinVerification): void {
  const { pin, verify, onAccept, onReject, rejectedMessage } = verification;

  verify(pin).then(
    (accepted) => (accepted ? onAccept() : onReject(rejectedMessage)),
    () => onReject(PIN_UNAVAILABLE_MESSAGE),
  );
}

/**
 * Vérifie le code une fois les quatre chiffres saisis. Une réponse arrivée
 * après un changement de saisie est ignorée.
 * @param options Code courant, vérification et réactions.
 */
export function usePinValidation(options: PinValidationOptions): void {
  const { pin, verify, onComplete, onError, shake } = options;
  const rejectedMessage = options.rejectedMessage ?? PIN_REJECTED_MESSAGE;

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    let active = true;
    const onAccept = () => active && onComplete();
    const onReject = (message: string) => active && rejectPin({ message, onError, shake });
    const timer = setTimeout(
      () => runVerification({ pin, verify, onAccept, onReject, rejectedMessage }),
      VERIFY_DELAY,
    );

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [pin, verify, onComplete, onError, shake, rejectedMessage]);
}
