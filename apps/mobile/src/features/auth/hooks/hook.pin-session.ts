import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { identityApi } from "../../../shared/api/config.api";
import { ApiClientError } from "../../../shared/api/error.api";
import { useAuthDraft } from "../model/model.auth-draft";
import { startServerAuth } from "../model/model.server-auth";
import { useServerChallenge } from "../model/store.server-challenge";

import { PIN_MISMATCH_MESSAGE, usePinChoice } from "./hook.pin-choice";

async function requestChallenge(pin: string): Promise<void> {
  const draft = useAuthDraft.getState();
  const challenge = await startServerAuth({
    draft,
    pin,
    api: identityApi,
    onRegistered: () => undefined,
  });
  useServerChallenge.getState().setChallenge(challenge);
}

async function verifyServerPin(pin: string): Promise<boolean> {
  try {
    await requestChallenge(pin);
    return true;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) return false;
    throw error;
  }
}

function useRequireAuthDraft() {
  useEffect(() => {
    if (useAuthDraft.getState().phone === "") router.replace("/(auth)/sign-in");
  }, []);
}

/**
 * Prépare le défi serveur et dirige vers la saisie OTP distincte.
 * @returns Le mode, la vérification, l'action de réussite, le retour et l'absence de brouillon.
 */
export function usePinSession() {
  const { mode, phone } = useAuthDraft();
  const isSignUp = mode === "sign-up";
  const complete = useCallback(() => {
    if (isSignUp) useAuthDraft.getState().startSignIn(phone);
    router.push("/(auth)/otp");
  }, [isSignUp, phone]);
  const choice = usePinChoice(verifyServerPin, complete);
  const confirming = isSignUp && choice.phase === "confirm";
  useRequireAuthDraft();
  return {
    isSignUp,
    phase: isSignUp ? choice.phase : null,
    verify: isSignUp ? choice.verify : verifyServerPin,
    complete: isSignUp ? choice.accept : complete,
    back: confirming ? choice.restart : router.back,
    rejectedMessage: confirming ? PIN_MISMATCH_MESSAGE : undefined,
    missingDraft: phone === "",
  };
}
