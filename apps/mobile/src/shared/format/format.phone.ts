import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Affiche un numéro au format international lisible, groupes séparés.
 * @param e164 Numéro au format E.164, par exemple « +242065706622 ».
 * @returns Le numéro lisible, par exemple « +242 06 570 6622 », ou le texte reçu s'il est illisible.
 */
export function formatPhone(e164: string): string {
  return parsePhoneNumberFromString(e164)?.formatInternational() ?? e164;
}
