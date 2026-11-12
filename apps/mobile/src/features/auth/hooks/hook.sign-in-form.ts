import { router } from "expo-router";
import { useState } from "react";

import { PIN_AUTH_DEPS } from "../api/deps.pin-auth";
import { useAuthDraft } from "../model/model.auth-draft";
import { PHONE_DIGITS, isValidPhoneDigits, toInternationalPhone } from "../model/model.auth-form";
import { hasAccount } from "../model/model.pin-auth";

/** Message affiché quand les neuf chiffres ne forment pas un numéro valide. */
const PHONE_ERROR = "Entrez un numéro congolais valide, par exemple 06 570 66 22.";

/** Message affiché quand aucun compte de ce numéro n'existe sur l'appareil. */
export const NO_ACCOUNT_ERROR =
  "Aucun compte n'est enregistré sur ce téléphone pour ce numéro. Créez un compte.";

/** Message affiché quand le trousseau de l'appareil ne répond pas. */
export const VAULT_ERROR = "Connexion impossible pour le moment. Réessayez.";

/**
 * Vérifie qu'un compte existe pour ce numéro, puis ouvre l'étape du code.
 * @param onError Reçoit le message à afficher en cas de refus.
 * @returns L'action qui lance la vérification pour un numéro.
 */
function useAccountCheck(onError: (message: string) => void) {
  const startSignIn = useAuthDraft((state) => state.startSignIn);

  const continueWith = (phone: string, known: boolean) => {
    if (!known) return onError(NO_ACCOUNT_ERROR);

    startSignIn(phone);
    router.push("/(auth)/pin");
  };

  return (phone: string) => {
    hasAccount(phone, PIN_AUTH_DEPS.vault).then(
      (known) => continueWith(phone, known),
      () => onError(VAULT_ERROR),
    );
  };
}

/**
 * Gère le numéro de la connexion et vérifie qu'un compte existe avant le code.
 * @returns Les chiffres saisis, le message, la validité et les actions.
 */
export function useSignInForm() {
  const [digits, setDigitsState] = useState("");
  const [submitError, setSubmitError] = useState("");
  const checkAccount = useAccountCheck(setSubmitError);
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
