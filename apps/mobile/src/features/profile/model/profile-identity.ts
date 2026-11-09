import { isValidPersonName } from "../../../shared/model/person-name";

/** Identité modifiable depuis le profil. */
export interface ProfileIdentityInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly occupation: string;
}

/**
 * Valide l'identité saisie dans le profil.
 * @param input Prénom, nom et profession.
 * @returns Le message d'erreur, ou une chaîne vide si tout est correct.
 */
export function profileIdentityError(input: ProfileIdentityInput): string {
  if (!isValidPersonName(input.firstName)) {
    return "Entrez un prénom d'au moins deux caractères.";
  }

  if (!isValidPersonName(input.lastName)) {
    return "Entrez un nom d'au moins deux caractères.";
  }

  if (!isValidPersonName(input.occupation)) {
    return "Indiquez votre profession ou votre formation.";
  }

  return "";
}
