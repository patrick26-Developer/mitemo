import { isValidPersonName } from "../../../shared/model/model.person-name";

/** Identité modifiable depuis le profil. */
export interface ProfileIdentityInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly occupation: string;
}

/** Champs d'identité à signaler après un enregistrement refusé. */
export interface ProfileIdentityInvalidFields {
  readonly firstName: boolean;
  readonly lastName: boolean;
  readonly occupation: boolean;
}

/**
 * Repère les champs d'identité à signaler en rouge après un refus.
 * @param input Prénom, nom et profession.
 * @returns Vrai pour chaque champ qui ne respecte pas sa règle.
 */
export function profileIdentityInvalidFields(
  input: ProfileIdentityInput,
): ProfileIdentityInvalidFields {
  return {
    firstName: !isValidPersonName(input.firstName),
    lastName: !isValidPersonName(input.lastName),
    occupation: !isValidPersonName(input.occupation),
  };
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
