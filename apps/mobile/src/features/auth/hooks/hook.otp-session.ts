import { useState } from "react";
import type { SessionResponse } from "@mitemo/contracts";
import { identityApi } from "../../../shared/api/config.api";
import { useAsyncAction } from "../../../shared/hooks/hook.async-action";
import { useSessionStore } from "../../../shared/session/store.session";
import { useAuthDraft } from "../model/model.auth-draft";
import { useServerChallenge } from "../model/store.server-challenge";

function acceptSession(session: SessionResponse): void {
  useServerChallenge.getState().setChallenge(null);
  useAuthDraft.getState().reset();
  useSessionStore.getState().signIn(session.user);
}

/**
 * Termine explicitement le défi OTP, puis ouvre la session serveur.
 * @returns La saisie, le défi, l'état réseau et l'action de vérification.
 */
export function useOtpSession() {
  const challenge = useServerChallenge((state) => state.challenge);
  const [otp, setOtp] = useState("");
  const action = useAsyncAction(() => "Code refusé ou connexion indisponible. Réessayez.");
  const submit = () => {
    if (!challenge || !/^\d{6}$/.test(otp)) return;
    action.run(async () =>
      acceptSession(await identityApi.verifyLogin({ challengeId: challenge.challengeId, otp })),
    );
  };
  return { challenge, otp, setOtp, pending: action.pending, error: action.error, submit };
}
