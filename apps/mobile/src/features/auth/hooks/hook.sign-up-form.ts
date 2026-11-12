import { router } from "expo-router";
import { useState } from "react";

import { useAuthDraft } from "../model/model.auth-draft";
import type { SignUpIdentity } from "../model/model.auth-draft";
import type { SignUpInvalidFields } from "../model/model.auth-form";
import {
  PHONE_DIGITS,
  isValidPhoneDigits,
  signUpError,
  signUpInvalidFields,
  toInternationalPhone,
} from "../model/model.auth-form";

/** Message affiché quand les neuf chiffres ne forment pas un numéro valide. */
const PHONE_ERROR = "Entrez un numéro congolais valide, par exemple 06 570 66 22.";

/** Champs modifiables du formulaire d'inscription. */
type SignUpField = "firstName" | "lastName" | "occupation" | "digits";

/** État du formulaire d'inscription. */
interface SignUpFormState {
  readonly firstName: string;
  readonly lastName: string;
  readonly occupation: string;
  readonly digits: string;
  readonly error: string;
}

/** Aucun champ à signaler tant que la saisie n'a pas été soumise. */
const NO_INVALID: SignUpInvalidFields = {
  firstName: false,
  lastName: false,
  occupation: false,
  digits: false,
};

/** État initial du formulaire. */
const INITIAL_FORM: SignUpFormState = {
  firstName: "",
  lastName: "",
  occupation: "",
  digits: "",
  error: "",
};

/**
 * Message de numéro incomplet, affiché seulement après les neuf chiffres.
 * @param digits Chiffres saisis.
 * @returns Le message d'erreur, ou une chaîne vide.
 */
function phoneHint(digits: string): string {
  return digits.length === PHONE_DIGITS && !isValidPhoneDigits(digits) ? PHONE_ERROR : "";
}

/**
 * Extrait l'identité nettoyée du formulaire.
 * @param state État courant du formulaire.
 * @returns Prénom, nom et profession sans espaces superflus.
 */
function identityOf(state: SignUpFormState): SignUpIdentity {
  return {
    firstName: state.firstName.trim(),
    lastName: state.lastName.trim(),
    occupation: state.occupation.trim(),
  };
}

/**
 * Valide la première étape, puis ouvre le choix du code ou signale le refus.
 * @param state Saisie courante.
 * @param startSignUp Mémorise l'identité et le numéro du brouillon.
 * @param report Affiche le message à corriger.
 */
function submitSignUp(
  state: SignUpFormState,
  startSignUp: (identity: SignUpIdentity, phone: string) => void,
  report: (message: string) => void,
): void {
  const error = signUpError(state);

  if (error !== "") {
    report(error);
    return;
  }

  startSignUp(identityOf(state), toInternationalPhone(state.digits));
  router.push("/(auth)/pin");
}

/**
 * Gère l'identité, le numéro et la validation de la première étape
 * d'inscription.
 * @returns Les champs, les messages et les actions du formulaire.
 */
export function useSignUpForm() {
  const [state, setState] = useState(INITIAL_FORM);
  const startSignUp = useAuthDraft((store) => store.startSignUp);
  const update = (field: SignUpField, value: string) => {
    setState((current) => ({ ...current, [field]: value, error: "" }));
  };
  const submit = () => {
    submitSignUp(state, startSignUp, (error) => setState((current) => ({ ...current, error })));
  };
  const message = state.error !== "" ? state.error : phoneHint(state.digits);
  const invalid = message === "" ? NO_INVALID : signUpInvalidFields(state);

  return {
    ...state,
    message,
    invalid,
    validPhone: isValidPhoneDigits(state.digits),
    submit,
    update,
  };
}

/** Champs et actions exposés par {@link useSignUpForm}. */
export type SignUpForm = ReturnType<typeof useSignUpForm>;
