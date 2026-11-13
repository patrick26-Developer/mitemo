import { checkDevicePin, registerPin } from "./model.pin-auth";
import type { PinAuthDeps } from "./model.pin-auth";

/** Une étape du changement de code : son titre et sa consigne. */
export interface PinChangeStep {
  readonly title: string;
  readonly prompt: string;
}

/** Les trois étapes du changement de code PIN. */
export const PIN_CHANGE_STEPS: readonly PinChangeStep[] = [
  { title: "Code actuel", prompt: "Saisissez votre code PIN actuel." },
  { title: "Nouveau code", prompt: "Choisissez un nouveau code de 4 chiffres." },
  { title: "Confirmation", prompt: "Saisissez le nouveau code une seconde fois." },
];

/** Refus d'un nouveau code identique à l'actuel. */
export const SAME_PIN_MESSAGE = "Le nouveau code doit être différent de l'actuel.";

/** Refus d'une confirmation qui ne reprend pas le nouveau code. */
export const PIN_MISMATCH_MESSAGE = "Les deux codes ne correspondent pas.";

/** Demande de changement de code. */
export interface PinChange {
  readonly current: string;
  readonly next: string;
}

/**
 * Indique si le nouveau code diffère de l'actuel.
 * @param current Code actuel.
 * @param next Nouveau code.
 * @returns `true` quand le nouveau code est différent.
 */
export function isNewPin(current: string, next: string): boolean {
  return current !== next;
}

/**
 * Remplace le code PIN du compte de l'appareil, une fois l'actuel reconnu et
 * le nouveau différent ; sinon le code reste inchangé. Le numéro vient du
 * trousseau, jamais du profil.
 * @param change Code actuel et nouveau code.
 * @param deps Trousseau et empreinte.
 * @returns `true` quand le code est remplacé.
 */
export async function changePin(change: PinChange, deps: PinAuthDeps): Promise<boolean> {
  if (!isNewPin(change.current, change.next)) return false;
  const credential = await deps.vault.load();
  if (credential === null || !(await checkDevicePin(change.current, deps))) return false;

  return registerPin({ phone: credential.phone, pin: change.next }, deps);
}
