import { router } from "expo-router";
import { useState } from "react";

import { useAuthDraft } from "../model/model.auth-draft";
import { TERMS_DECLINED } from "../model/model.terms";
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
  /** Vrai pendant le rappel des conditions d'utilisation. */
  readonly termsOpen: boolean;
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
  termsOpen: false,
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
 * Poursuit l'inscription une fois les conditions acceptées : l'identité et le
 * numéro sont mémorisés, et le compte sera créé avec ce profil après le code PIN.
 * @param state Saisie validée.
 * @param startSignUp Mémorise l'identité et le numéro du brouillon.
 */
function continueSignUp(
  state: SignUpFormState,
  startSignUp: (identity: SignUpIdentity, phone: string) => void,
): void {
  startSignUp(identityOf(state), toInternationalPhone(state.digits));
  router.push("/(auth)/pin");
}

/** Ce dont dépendent les réponses au rappel des conditions. */
interface TermsContext {
  readonly state: SignUpFormState;
  readonly patch: (change: Partial<SignUpFormState>) => void;
  readonly startSignUp: (identity: SignUpIdentity, phone: string) => void;
}

/**
 * Réponses au rappel des conditions : accepter poursuit l'inscription,
 * refuser ferme la feuille et explique qu'aucun compte n'est créé.
 * @param context Saisie, mise à jour et démarrage de l'inscription.
 * @returns L'acceptation et le refus.
 */
function termsHandlers(context: TermsContext) {
  const { state, patch, startSignUp } = context;
  return {
    acceptTerms: () => {
      patch({ termsOpen: false });
      continueSignUp(state, startSignUp);
    },
    declineTerms: () => patch({ termsOpen: false, error: TERMS_DECLINED }),
  };
}

/**
 * Gère l'identité, le numéro et la validation de la première étape
 * d'inscription.
 * @returns Les champs, les messages et les actions du formulaire.
 */
export function useSignUpForm() {
  const [state, setState] = useState(INITIAL_FORM);
  const startSignUp = useAuthDraft((store) => store.startSignUp);
  const patch = (change: Partial<SignUpFormState>) =>
    setState((current) => ({ ...current, ...change }));
  const update = (field: SignUpField, value: string) => patch({ [field]: value, error: "" });
  const submit = () => {
    const error = signUpError(state);
    patch(error === "" ? { termsOpen: true } : { error });
  };
  const message = state.error !== "" ? state.error : phoneHint(state.digits);
  const invalid = message === "" ? NO_INVALID : signUpInvalidFields(state);
  const terms = termsHandlers({ state, patch, startSignUp });
  const validPhone = isValidPhoneDigits(state.digits);

  return { ...state, message, invalid, validPhone, submit, update, ...terms };
}

/** Champs et actions exposés par {@link useSignUpForm}. */
export type SignUpForm = ReturnType<typeof useSignUpForm>;
