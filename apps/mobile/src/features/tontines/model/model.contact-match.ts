import { parsePhoneNumberFromString } from "libphonenumber-js";

import type { MemberContact } from "../../../shared/member/model.portfolio-create";

/** Indicatif pays par défaut des numéros du répertoire : République du Congo. */
const DEFAULT_COUNTRY = "CG";

/** Contact tel qu'il figure dans le répertoire du téléphone. */
export interface PhoneContact {
  readonly name: string;
  /** Numéro saisi librement dans le répertoire. */
  readonly phone: string;
}

/** Personne déjà liée à la tontine, membre ou invitée, reconnue à son numéro E.164. */
export interface KnownPhone {
  readonly phone?: string | undefined;
}

/** Ce qu'il faut pour proposer les contacts à inscrire dans une tontine. */
export interface ContactMatchInput {
  readonly contacts: readonly PhoneContact[];
  /** Numéros E.164 qui ont un compte Mitemo. */
  readonly accounts: ReadonlySet<string>;
  /** Membres déjà inscrits et contacts déjà invités, à ne pas proposer de nouveau. */
  readonly members: readonly KnownPhone[];
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

/** Contacts du répertoire, répartis comme dans l'ajout d'un groupe WhatsApp. */
export interface SplitContacts {
  /** Contacts qui ont un compte Mitemo : on les ajoute directement. */
  readonly onMitemo: readonly MemberContact[];
  /** Autres contacts au numéro valide : on les invite à rejoindre Mitemo. */
  readonly others: readonly MemberContact[];
}

/**
 * Contacts du répertoire au numéro valide, sans doublon ni membre déjà
 * inscrit ou invité, triés par nom.
 * @param input Répertoire et membres connus.
 * @returns Les contacts proposables, au format E.164.
 */
function candidateContacts(input: ContactMatchInput): readonly MemberContact[] {
  const taken = new Set(input.members.map((member) => member.phone));
  const found = new Map<string, MemberContact>();
  for (const contact of input.contacts) {
    const phone = toE164(contact.phone);
    if (phone !== null && !taken.has(phone) && !found.has(phone)) {
      found.set(phone, { name: contact.name, phone });
    }
  }
  return [...found.values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

/**
 * Sépare les contacts qui ont un compte Mitemo, à ajouter, des autres, à
 * inviter sur Mitemo.
 * @param input Répertoire, comptes Mitemo connus et membres de la tontine.
 * @returns Les deux groupes de contacts, triés par nom.
 */
export function splitContacts(input: ContactMatchInput): SplitContacts {
  const candidates = candidateContacts(input);
  return {
    onMitemo: candidates.filter((contact) => input.accounts.has(contact.phone)),
    others: candidates.filter((contact) => !input.accounts.has(contact.phone)),
  };
}
