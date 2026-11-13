import { parsePhoneNumberFromString } from "libphonenumber-js";

/** Moyens de joindre le service client, prêts à ouvrir. */
export interface SupportContact {
  /** Numéro lisible, par exemple « +242 06 570 6622 ». */
  readonly display: string;
  /** Lien de discussion WhatsApp (wa.me suivi du numéro, chiffres seuls). */
  readonly whatsappUrl: string;
  /** Lien d'appel téléphonique classique. */
  readonly callUrl: string;
}

/**
 * Valide le numéro du service client lu dans la configuration et prépare
 * ses liens WhatsApp et d'appel. Un numéro national est rattaché au Congo.
 * @param raw Valeur brute de la configuration.
 * @returns Les moyens de contact, ou `null` si le numéro manque ou est invalide.
 */
export function parseSupportContact(raw: string | undefined): SupportContact | null {
  const phone = parsePhoneNumberFromString(raw ?? "", "CG");
  if (phone === undefined || !phone.isValid()) return null;

  return {
    display: phone.formatInternational(),
    whatsappUrl: `https://wa.me/${phone.number.slice(1)}`,
    callUrl: `tel:${phone.number}`,
  };
}
