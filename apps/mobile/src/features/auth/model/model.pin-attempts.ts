/** Nombre de codes incorrects tolérés avant la suspension du compte. */
export const MAX_PIN_ATTEMPTS = 5;

/**
 * Essais qui restent au membre après ses échecs.
 * @param failures Codes incorrects saisis depuis le dernier code juste.
 * @returns Le nombre d'essais restants, jamais négatif.
 */
export function remainingAttempts(failures: number): number {
  return Math.max(MAX_PIN_ATTEMPTS - failures, 0);
}

/**
 * Indique si le compte est suspendu : tous les essais sont épuisés.
 * @param failures Codes incorrects saisis depuis le dernier code juste.
 * @returns `true` quand le compte est suspendu.
 */
export function isSuspended(failures: number): boolean {
  return remainingAttempts(failures) === 0;
}

/**
 * Message du toast après un code incorrect : les essais restants, ou la
 * suspension du compte.
 * @param failures Codes incorrects, celui-ci compris.
 * @returns Le message à afficher.
 */
export function failedPinMessage(failures: number): string {
  const remaining = remainingAttempts(failures);
  if (remaining === 0) {
    return `Compte suspendu après ${MAX_PIN_ATTEMPTS} codes incorrects. Contactez le service client.`;
  }

  return `Code incorrect. Il vous reste ${remaining} ${remaining === 1 ? "essai" : "essais"}.`;
}
