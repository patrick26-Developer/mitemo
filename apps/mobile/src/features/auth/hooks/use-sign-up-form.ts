import { router } from "expo-router";
import { useState } from "react";

import { useAuthDraft } from "../model/auth-draft";
import {
  PHONE_DIGITS,
  isValidPhoneDigits,
  signUpError,
  toInternationalPhone,
} from "../model/auth-form";

/** Message affiché quand les neuf chiffres ne forment pas un numéro valide. */
const PHONE_ERROR = "Entrez un numéro congolais valide, par exemple 06 570 66 22.";

/** Champs modifiables du formulaire d'inscription. */
type SignUpField = "name" | "digits";

/** État du formulaire d'inscription. */
interface SignUpFormState {
  readonly name: string;
  readonly digits: string;
  readonly error: string;
}

/** État initial du formulaire. */
const INITIAL_FORM: SignUpFormState = { name: "", digits: "", error: "" };

/**
 * Message de numéro incomplet, affiché seulement après les neuf chiffres.
 * @param digits Chiffres saisis.
 * @returns Le message d'erreur, ou une chaîne vide.
 */
function phoneHint(digits: string): string {
  return digits.length === PHONE_DIGITS && !isValidPhoneDigits(digits) ? PHONE_ERROR : "";
}

/**
 * Gère le nom, le numéro et la validation de la première étape d'inscription.
 * @returns Les champs, les messages et les actions du formulaire.
 */
export function useSignUpForm() {
  const [state, setState] = useState(INITIAL_FORM);
  const startSignUp = useAuthDraft((store) => store.startSignUp);
  const update = (field: SignUpField, value: string) => {
    setState((current) => ({ ...current, [field]: value, error: "" }));
  };
  const submit = () => {
    const error = signUpError(state.name, state.digits);

    if (error !== "") {
      setState((current) => ({ ...current, error }));
      return;
    }

    startSignUp(state.name.trim(), toInternationalPhone(state.digits));
    router.push("/(auth)/pin");
  };
  const message = state.error !== "" ? state.error : phoneHint(state.digits);

  return { ...state, message, validPhone: isValidPhoneDigits(state.digits), submit, update };
}
