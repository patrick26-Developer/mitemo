/** Longueur minimale d'un prénom, d'un nom ou d'une profession. */
export const MIN_PERSON_NAME_LENGTH = 2;

/**
 * Indique si un prénom, un nom ou une profession est assez long pour identifier
 * le membre.
 * @param value Saisie à contrôler.
 * @returns Vrai si la saisie contient au moins deux caractères utiles.
 */
export function isValidPersonName(value: string): boolean {
  return value.trim().length >= MIN_PERSON_NAME_LENGTH;
}
