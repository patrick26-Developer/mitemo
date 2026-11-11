import { parsePhoneNumberFromString } from "libphonenumber-js";

import type { TontineMember } from "../../../shared/member/model.portfolio";
import type { MemberContact } from "../../../shared/member/model.portfolio-create";

/** Indicatif pays par défaut des numéros du répertoire : République du Congo. */
const DEFAULT_COUNTRY = "CG";

/** Contact tel qu'il figure dans le répertoire du téléphone. */
export interface PhoneContact {
  readonly name: string;
  /** Numéro saisi librement dans le répertoire. */
  readonly phone: string;
}

/** Ce qu'il faut pour proposer les contacts à inscrire dans une tontine. */
export interface ContactMatchInput {
  readonly contacts: readonly PhoneContact[];
  /** Numéros E.164 qui ont un compte Mitemo. */
  readonly accounts: ReadonlySet<string>;
  /** Membres déjà inscrits, à ne pas proposer de nouveau. */
  readonly members: readonly TontineMember[];
}

/**
 * Met un numéro du répertoire au format international E.164, en le lisant
 * comme congolais quand il n'a pas d'indicatif.
 * @param raw Numéro tel qu'il est saisi.
 * @returns Le numéro E.164, ou `null` s'il n'est pas valide.
 */
export function toE164(raw: string): string | null {
  const parsed = parsePhoneNumberFromString(raw, DEFAULT_COUNTRY);
  return parsed?.isValid() === true ? parsed.number : null;
}

/**
 * Retient les contacts du répertoire qui ont un compte Mitemo et ne sont pas
 * encore membres : un numéro n'apparaît qu'une fois, sous le premier nom
 * trouvé, et la liste est triée par nom.
 * @param input Contacts du répertoire, comptes Mitemo et membres inscrits.
 * @returns Les contacts à proposer, numéros au format E.164.
 */
export function mitemoContacts(input: ContactMatchInput): readonly MemberContact[] {
  const taken = new Set(input.members.map((member) => member.phone));
  const found = new Map<string, MemberContact>();
  for (const contact of input.contacts) {
    const phone = toE164(contact.phone);
    if (phone === null || taken.has(phone) || found.has(phone) || !input.accounts.has(phone))
      continue;
    found.set(phone, { name: contact.name, phone });
  }
  return [...found.values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
}
