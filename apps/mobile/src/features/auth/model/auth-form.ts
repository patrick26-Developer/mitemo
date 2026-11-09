import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { PhoneNumber } from "libphonenumber-js";

import { isValidPersonName } from "../../../shared/model/person-name";

/** Pays par défaut des numéros saisis, le Congo-Brazzaville. */
export const DEFAULT_PHONE_COUNTRY = "CG";

/** Indicatif téléphonique du Congo-Brazzaville. */
export const PHONE_COUNTRY_CODE = "+242";

/** Nombre de chiffres d'un numéro congolais saisi sans indicatif. */
export const PHONE_DIGITS = 9;

/** Nombre de chiffres du code PIN. */
export const PIN_LENGTH = 4;

/** Code PIN de démonstration, en attendant la vérification par l'API. */
export const DEMO_PIN = "1234";

/** Saisie de la première étape d'inscription. */
export interface SignUpInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly occupation: string;
  /** Chiffres du numéro local, sans indicatif. */
  readonly digits: string;
}

/** Groupes de chiffres du numéro local : 2-3-2-2. */
const PHONE_GROUPS = [2, 5, 7, 9] as const;

/**
 * Complète un numéro congolais saisi sans indicatif.
 * @param input Numéro saisi par le membre, avec ou sans espaces.
 * @returns Le numéro au format international, ou la saisie nettoyée.
 */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (!trimmed.startsWith("+") && digits.length === PHONE_DIGITS && digits.startsWith("0")) {
    return `${PHONE_COUNTRY_CODE}${digits}`;
  }

  if (!trimmed.startsWith("+") && digits.length === 12 && digits.startsWith("242")) {
    return `+${digits}`;
  }

  return trimmed;
}

/**
 * Analyse un numéro comme un numéro congolais.
 * @param input Numéro saisi.
 * @returns Le numéro analysé, ou `undefined` si la saisie est inexploitable.
 */
function parsePhone(input: string): PhoneNumber | undefined {
  const parsed = parsePhoneNumberFromString(normalizePhone(input), DEFAULT_PHONE_COUNTRY);

  return parsed?.isValid() === true ? parsed : undefined;
}

/**
 * Indique si la saisie est un numéro de téléphone congolais valide.
 * @param input Numéro saisi.
 * @returns Vrai si le numéro peut recevoir un code.
 */
export function isValidPhone(input: string): boolean {
  return parsePhone(input) !== undefined;
}

/**
 * Formate un numéro pour l'affichage et le stockage local.
 * @param input Numéro saisi.
 * @returns Le numéro international lisible, ou la saisie nettoyée.
 */
export function formatPhoneForDisplay(input: string): string {
  return parsePhone(input)?.formatInternational() ?? input.trim();
}

/**
 * Ne garde que les neuf premiers chiffres d'une saisie téléphonique.
 * @param input Saisie brute du champ.
 * @returns Les chiffres utiles du numéro local.
 */
export function keepPhoneDigits(input: string): string {
  return input.replace(/\D/g, "").slice(0, PHONE_DIGITS);
}

/**
 * Groupe les chiffres du numéro local pour la saisie : 2-3-2-2.
 * @param digits Chiffres du numéro local.
 * @returns Le numéro lisible, par exemple « 06 570 66 22 ».
 */
export function formatPhoneInput(digits: string): string {
  const groups = PHONE_GROUPS.map((end, index) => {
    const start = index === 0 ? 0 : PHONE_GROUPS[index - 1];

    return digits.slice(start, end);
  });

  return groups.filter((group) => group !== "").join(" ");
}

/**
 * Convertit les chiffres saisis en numéro international prêt à enregistrer.
 * @param digits Chiffres du numéro local.
 * @returns Le numéro au format international, ou la saisie conservée si elle est invalide.
 */
export function toInternationalPhone(digits: string): string {
  return formatPhoneForDisplay(`${PHONE_COUNTRY_CODE}${digits}`);
}

/**
 * Indique si les chiffres saisis forment un numéro congolais complet et valide.
 * @param digits Chiffres du numéro local.
 * @returns Vrai si le numéro peut être utilisé pour la connexion.
 */
export function isValidPhoneDigits(digits: string): boolean {
  return digits.length === PHONE_DIGITS && isValidPhone(`${PHONE_COUNTRY_CODE}${digits}`);
}

/**
 * Indique si le PIN contient exactement quatre chiffres.
 * @param pin PIN saisi.
 * @returns Vrai si le PIN a le bon format.
 */
export function isValidPin(pin: string): boolean {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);
}

/**
 * Indique si le code correspond au PIN de démonstration.
 * @param pin PIN saisi.
 * @returns Vrai si le code ouvre la session.
 */
export function isValidDemoPin(pin: string): boolean {
  return pin === DEMO_PIN;
}

/**
 * Valide l'identité et le numéro de la première étape d'inscription.
 * @param input Prénom, nom, profession et chiffres du numéro.
 * @returns Le message d'erreur, ou une chaîne vide si tout est correct.
 */
export function signUpError(input: SignUpInput): string {
  if (!isValidPersonName(input.firstName)) {
    return "Entrez un prénom d'au moins deux caractères.";
  }

  if (!isValidPersonName(input.lastName)) {
    return "Entrez un nom d'au moins deux caractères.";
  }

  if (!isValidPersonName(input.occupation)) {
    return "Indiquez votre profession ou votre formation.";
  }

  if (!isValidPhoneDigits(input.digits)) {
    return "Entrez un numéro congolais valide, par exemple 06 570 66 22.";
  }

  return "";
}
