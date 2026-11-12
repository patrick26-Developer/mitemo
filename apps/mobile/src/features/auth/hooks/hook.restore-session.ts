import { useEffect, useState } from "react";
import { identityApi } from "../../../shared/api/config.api";
import { secureSessionTokenVault } from "../../../shared/api/vault.session-token";
import { useSessionStore } from "../../../shared/session/store.session";
import { restoreServerSession } from "../model/model.restore-session";

function restoreOnLaunch(onReady: () => void): () => void {
  let active = true;
  restoreServerSession({
    vault: secureSessionTokenVault,
    me: () => identityApi.me(),
    now: Date.now(),
  })
    .then(
      (user) => user && active && useSessionStore.getState().signIn(user),
      () => active && useSessionStore.getState().signOut(),
    )
    .finally(() => {
      if (active) onReady();
    });
  return () => {
    active = false;
  };
}

/**
 * Relit le jeton au démarrage, sans ouvrir de session sur un échec réseau.
 * @returns Vrai quand la restauration est terminée, même sans session.
 */
export function useRestoreSession(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => restoreOnLaunch(() => setReady(true)), []);
  return ready;
}
