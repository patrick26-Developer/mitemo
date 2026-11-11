/** Résultat d'une saisie de formulaire : valeur acceptée ou message à corriger. */
export type FormResult<Value> =
  { readonly ok: true; readonly value: Value } | { readonly ok: false; readonly message: string };

/**
 * Construit un résultat accepté.
 * @param value Valeur validée.
 * @returns Le résultat accepté.
 */
export function formOk<Value>(value: Value): FormResult<Value> {
  return { ok: true, value };
}

/**
 * Construit un résultat refusé.
 * @param message Message affiché à l'utilisateur.
 * @returns Le résultat refusé.
 */
export function formError<Value>(message: string): FormResult<Value> {
  return { ok: false, message };
}
