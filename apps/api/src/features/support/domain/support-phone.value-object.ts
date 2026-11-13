import { parsePhoneNumberFromString } from "libphonenumber-js";

import { InvalidSupportPhoneError } from "./invalid-support-phone.error.js";

/** Numéro du service client, validé et normalisé au format E.164. */
export class SupportPhone {
  private constructor(readonly e164: string) {}

  /**
   * Valide un numéro ; un numéro national est rattaché au Congo.
   * @param raw Numéro saisi dans la configuration.
   * @returns Le numéro normalisé.
   * @throws {InvalidSupportPhoneError} si le numéro est illisible ou invalide.
   */
  static parse(raw: string): SupportPhone {
    const phone = parsePhoneNumberFromString(raw, "CG");
    if (phone === undefined || !phone.isValid()) throw new InvalidSupportPhoneError(raw);

    return new SupportPhone(phone.number);
  }
}
