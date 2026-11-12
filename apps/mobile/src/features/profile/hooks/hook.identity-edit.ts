import { useState } from "react";

import type { MemberProfile } from "../../../shared/member/store.member";
import { useMemberStore } from "../../../shared/member/store.member";
import type {
  ProfileIdentityInput,
  ProfileIdentityInvalidFields,
} from "../model/model.profile-identity";
import {
  profileIdentityError,
  profileIdentityInvalidFields,
} from "../model/model.profile-identity";

/** Champs modifiables du formulaire d'identité. */
export type IdentityField = "firstName" | "lastName" | "occupation";

/** État local du formulaire d'identité. */
export interface IdentityFormState {
  readonly firstName: string;
  readonly lastName: string;
  readonly occupation: string;
  readonly error: string;
}

/** Aucun champ à signaler tant que l'enregistrement n'a pas été tenté. */
const NO_INVALID: ProfileIdentityInvalidFields = {
  firstName: false,
  lastName: false,
  occupation: false,
};

/** État et actions du formulaire d'identité du profil. */
export interface IdentityEdit {
  readonly form: IdentityFormState;
  /** Champs à signaler en rouge, une fois l'enregistrement refusé. */
  readonly invalid: ProfileIdentityInvalidFields;
  readonly update: (field: IdentityField, value: string) => void;
  readonly save: () => void;
}

/**
 * Construit l'état initial du formulaire à partir du profil courant.
 * @param member Profil du membre connecté.
 * @returns Les valeurs initiales du formulaire.
 */
function initialForm(member: MemberProfile): IdentityFormState {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    occupation: member.occupation,
    error: "",
  };
}

/**
 * Retire les espaces superflus saisis dans les champs.
 * @param form État courant du formulaire.
 * @returns L'identité prête à être enregistrée.
 */
function trimmedIdentity(form: IdentityFormState): ProfileIdentityInput {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    occupation: form.occupation.trim(),
  };
}

/**
 * Gère la saisie et l'enregistrement de l'identité depuis le profil.
 * @param onDone Retour à l'affichage en lecture seule.
 * @returns L'état du formulaire et ses actions.
 */
export function useIdentityEdit(onDone: () => void): IdentityEdit {
  const member = useMemberStore();
  const [form, setForm] = useState<IdentityFormState>(() => initialForm(member));
  const update = (field: IdentityField, value: string) =>
    setForm((current) => ({ ...current, [field]: value, error: "" }));
  const save = () => {
    const error = profileIdentityError(form);

    if (error !== "") {
      setForm((current) => ({ ...current, error }));
      return;
    }

    member.updateIdentity({ ...trimmedIdentity(form), phone: member.phone });
    onDone();
  };

  const invalid = form.error === "" ? NO_INVALID : profileIdentityInvalidFields(form);

  return { form, invalid, update, save };
}
