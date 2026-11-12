import { Contact, ContactField, requestPermissionsAsync } from "expo-contacts";

import type { PhoneContact } from "../model/model.contact-match";

/** Champs lus dans le répertoire : le nom et les numéros, rien d'autre. */
const FIELDS = [ContactField.FULL_NAME, ContactField.PHONES] as const;

/** Résultat de la lecture du répertoire. */
export type DeviceContactsResult =
  | { readonly status: "denied" }
  | { readonly status: "granted"; readonly contacts: readonly PhoneContact[] };

/**
 * Demande l'accès au répertoire puis en lit les noms et numéros, un contact
 * par numéro. Un contact sans nom prend son numéro comme nom.
 * @returns Les contacts, ou le refus d'accès.
 */
export async function readDeviceContacts(): Promise<DeviceContactsResult> {
  const permission = await requestPermissionsAsync();
  if (!permission.granted) return { status: "denied" };

  const details = await Contact.getAllDetails(FIELDS);
  const contacts = details.flatMap((entry) =>
    (entry.phones ?? []).flatMap((phone) =>
      phone.number === undefined
        ? []
        : [{ name: entry.fullName ?? phone.number, phone: phone.number }],
    ),
  );
  return { status: "granted", contacts };
}
