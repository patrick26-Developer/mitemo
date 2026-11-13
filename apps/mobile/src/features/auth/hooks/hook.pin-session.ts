import { router } from "expo-router";
import { useCallback, useEffect } from "react";

import { useCelebrationStore } from "../../../shared/feedback/store.celebration";
import { useMemberStore } from "../../../shared/member/store.member";
import { todayUtc } from "../../../shared/model/model.clock";
import { useSessionStore } from "../../../shared/session/store.session";
import { PIN_AUTH_DEPS } from "../api/deps.pin-auth";
import { useAuthDraft } from "../model/model.auth-draft";
import { registerPin } from "../model/model.pin-auth";
import { useGuardedPinCheck } from "./hook.guarded-pin";
import { PIN_MISMATCH_MESSAGE, usePinChoice } from "./hook.pin-choice";

/**
 * Retient le membre de l'appareil : l'identité complète d'une inscription,
 * ou le numéro d'une connexion, pour que le profil et le code PIN parlent du
 * même compte.
 * @param draft Brouillon du parcours.
 */
function recordMember(draft: ReturnType<typeof useAuthDraft.getState>): void {
  const member = useMemberStore.getState();
  const { firstName, lastName, occupation, phone } = draft;
  if (draft.mode === "sign-up") {
    member.registerMember({ firstName, lastName, occupation, phone }, todayUtc());
  } else member.rememberPhone(phone);
}

/**
 * Fin du parcours : retient le membre, efface le brouillon et ouvre la
 * session. Le garde de navigation ouvre les onglets, sous les confettis après
 * une inscription.
 * @returns Le brouillon, le mode et l'action de réussite.
 */
function useSessionCompletion() {
  const draft = useAuthDraft();
  const signIn = useSessionStore((state) => state.signIn);
  const celebrate = useCelebrationStore((state) => state.celebrate);
  const isSignUp = draft.mode === "sign-up";
  const complete = useCallback(() => {
    recordMember(useAuthDraft.getState());
    useAuthDraft.getState().reset();
    signIn();
    if (isSignUp) celebrate();
  }, [isSignUp, signIn, celebrate]);

  return { phone: draft.phone, isSignUp, complete };
}

/**
 * Vérifications du code pour un numéro : enregistrement à l'inscription,
 * comparaison avec le trousseau à la connexion.
 * @param phone Numéro au format international.
 * @returns Les deux vérifications.
 */
function usePinChecks(phone: string) {
  const register = useCallback(
    (pin: string) => registerPin({ phone, pin }, PIN_AUTH_DEPS),
    [phone],
  );
  const { verify: check, suspended } = useGuardedPinCheck(phone);
  return { register, check, suspended };
}

/**
 * Prépare l'écran du code : à la connexion, le code est vérifié ; à
 * l'inscription, il est choisi puis confirmé avant d'être enregistré.
 * @returns Le mode, l'étape du code, la vérification, l'action de réussite, le
 * retour, le message de refus et l'absence de brouillon.
 */
export function usePinSession() {
  const { phone, isSignUp, complete } = useSessionCompletion();
  const checks = usePinChecks(phone);
  const choice = usePinChoice(checks.register, complete);
  const confirming = isSignUp && choice.phase === "confirm";
  useEffect(() => {
    // Contrôle à la seule ouverture : la réussite vide le brouillon, et une
    // vérification continue annulerait l'ouverture des onglets.
    if (useAuthDraft.getState().phone === "") router.replace("/(auth)/sign-in");
  }, []);

  return {
    isSignUp,
    phase: isSignUp ? choice.phase : null,
    verify: isSignUp ? choice.verify : checks.check,
    complete: isSignUp ? choice.accept : complete,
    back: confirming ? choice.restart : router.back,
    rejectedMessage: confirming ? PIN_MISMATCH_MESSAGE : undefined,
    missingDraft: phone === "",
    suspended: !isSignUp && checks.suspended,
  };
}
