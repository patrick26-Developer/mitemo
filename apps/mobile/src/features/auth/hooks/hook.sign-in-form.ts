import { router } from "expo-router";
import { useState } from "react";

import { useAuthDraft } from "../model/model.auth-draft";
import { PHONE_DIGITS, isValidPhoneDigits, toInternationalPhone } from "../model/model.auth-form";

/** Message affiché quand les neuf chiffres ne forment pas un numéro valide. */
const PHONE_ERROR = "Entrez un numéro congolais valide, par exemple 06 570 66 22.";

/**
 * Ouvre l'étape du code ; seul le serveur décide si le compte existe.
 * @returns L'action qui lance la vérification pour un numéro.
 */
function useAccountCheck() {
  const startSignIn = useAuthDraft((state) => state.startSignIn);
  return (phone: string) => {
    startSignIn(phone);
    router.push("/(auth)/pin");
  };
}

/**
 * Gère le numéro de la connexion sans imposer un compte déjà connu de l'appareil.
 * @returns Les chiffres saisis, le message, la validité et les actions.
 */
export function useSignInForm() {
  const [digits, setDigitsState] = useState("");
  const [submitError, setSubmitError] = useState("");
  const checkAccount = useAccountCheck();
  const valid = isValidPhoneDigits(digits);
  const invalid = digits.length === PHONE_DIGITS && !valid;
  const phoneError = invalid ? PHONE_ERROR : "";

  const setDigits = (value: string) => {
    setSubmitError("");
    setDigitsState(value);
  };
  const submit = () => {
    if (valid) checkAccount(toInternationalPhone(digits));
  };

  return { digits, setDigits, valid, invalid, error: submitError || phoneError, submit };
}
