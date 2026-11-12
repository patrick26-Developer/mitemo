import { useEffect, useState } from "react";

import type { MemberContact } from "../../../shared/member/model.portfolio-create";
import { readDeviceContacts } from "../api/api.device-contacts";
import { findMitemoAccounts } from "../api/api.mitemo-directory";
import type { KnownPhone } from "../model/model.contact-match";
import { mitemoContacts, toE164 } from "../model/model.contact-match";

/** État de la recherche des contacts à inscrire. */
export type MemberPickerState =
  | { readonly status: "loading" }
  | { readonly status: "denied" }
  | { readonly status: "ready"; readonly contacts: readonly MemberContact[] };

/**
 * Lit le répertoire, demande à l'annuaire Mitemo lesquels de ses numéros ont
 * un compte, et retient ceux qui ne sont pas encore membres.
 * @param members Membres déjà inscrits.
 * @returns L'état final de la recherche.
 */
async function loadMitemoContacts(members: readonly KnownPhone[]): Promise<MemberPickerState> {
  const device = await readDeviceContacts();
  if (device.status === "denied") return device;

  const phones = device.contacts.flatMap((contact) => toE164(contact.phone) ?? []);
  const accounts = await findMitemoAccounts([...new Set(phones)]);
  return {
    status: "ready",
    contacts: mitemoContacts({ contacts: device.contacts, accounts, members }),
  };
}

/**
 * Cherche, à l'ouverture, les contacts du répertoire qui ont un compte Mitemo
 * et peuvent être inscrits dans la tontine. Seuls les numéros que le membre a
 * déjà dans son répertoire sont proposés.
 * @param members Membres déjà inscrits et contacts déjà invités, à écarter ; liste stable entre deux rendus.
 * @returns L'état de la recherche : en cours, accès refusé ou contacts trouvés.
 */
export function useMemberPicker(members: readonly KnownPhone[]): MemberPickerState {
  const [state, setState] = useState<MemberPickerState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    void loadMitemoContacts(members).then((result) => {
      if (active) setState(result);
    });
    return () => {
      active = false;
    };
  }, [members]);

  return state;
}
