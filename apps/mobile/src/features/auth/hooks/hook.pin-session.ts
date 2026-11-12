import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { identityApi } from "../../../shared/api/config.api";
import { ApiClientError } from "../../../shared/api/error.api";
import { useAuthDraft } from "../model/model.auth-draft";
import { startServerAuth } from "../model/model.server-auth";
import { useServerChallenge } from "../model/store.server-challenge";

async function requestChallenge(pin: string): Promise<void> {
  const draft = useAuthDraft.getState();
  const challenge = await startServerAuth({
    draft,
    pin,
    api: identityApi,
    onRegistered: () => useAuthDraft.getState().startSignIn(draft.phone),
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

/**
 * Prépare le défi serveur et dirige vers la saisie OTP distincte.
 * @returns Le mode, la vérification, l'action de réussite, le retour et l'absence de brouillon.
 */
export function usePinSession() {
  const { mode, phone } = useAuthDraft();
  const isSignUp = mode === "sign-up";
  const missingDraft = phone === "";
  const complete = useCallback(() => router.push("/(auth)/otp"), []);
  const back = useCallback(() => router.back(), []);
  useEffect(() => {
    if (useAuthDraft.getState().phone === "") router.replace("/(auth)/sign-in");
  }, []);
  return { isSignUp, verify: verifyServerPin, complete, back, missingDraft };
}
