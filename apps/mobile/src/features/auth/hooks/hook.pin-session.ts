import { router } from "expo-router";
import { useCallback, useEffect } from "react";

import { useMemberStore } from "../../../shared/member/store.member";
import { todayUtc } from "../../../shared/model/model.clock";
import { useSessionStore } from "../../../shared/session/store.session";
import { PIN_AUTH_DEPS } from "../api/deps.pin-auth";
import { useAuthDraft } from "../model/model.auth-draft";
import { checkPin, registerPin } from "../model/model.pin-auth";

/**
 * Choisit la vérification du code : enregistrement à l'inscription,
 * comparaison avec le trousseau à la connexion.
 * @param isSignUp Vrai pendant une inscription.
 * @param phone Numéro au format international.
 * @returns La vérification à lancer sur un code complet.
 */
function usePinVerify(isSignUp: boolean, phone: string) {
  return useCallback(
    (pin: string) => (isSignUp ? registerPin : checkPin)({ phone, pin }, PIN_AUTH_DEPS),
    [isSignUp, phone],
  );
}

/**
 * Prépare la fin du parcours : vérifie ou enregistre le code, enregistre
 * l'identité d'une inscription, efface le brouillon et ouvre la session. Le
 * garde de navigation ouvre alors les onglets.
 * @returns Le mode, la vérification, l'action de réussite, le retour et l'absence de brouillon.
 */
export function usePinSession() {
  const { mode, firstName, lastName, occupation, phone, reset } = useAuthDraft();
  const registerMember = useMemberStore((state) => state.registerMember);
  const signIn = useSessionStore((state) => state.signIn);
  const isSignUp = mode === "sign-up";
  const missingDraft = phone === "";

  const verify = usePinVerify(isSignUp, phone);
  const complete = useCallback(() => {
    if (isSignUp) registerMember({ firstName, lastName, occupation, phone }, todayUtc());

    reset();
    signIn();
  }, [isSignUp, firstName, lastName, occupation, phone, reset, signIn, registerMember]);

  const back = useCallback(() => router.back(), []);

  useEffect(() => {
    // Contrôle à la seule ouverture : la réussite vide le brouillon, et une
    // vérification continue annulerait l'ouverture des onglets.
    if (useAuthDraft.getState().phone === "") router.replace("/(auth)/sign-in");
  }, []);

  return { isSignUp, verify, complete, back, missingDraft };
}
