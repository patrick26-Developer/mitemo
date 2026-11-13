import { useEffect } from "react";
import { AppState } from "react-native";

import { isIdleTooLong } from "./model.auto-lock";
import { useActivityStore } from "./store.activity";
import { useAutoLockStore } from "./store.auto-lock";
import { useSessionStore } from "./store.session";

/** Intervalle de contrôle de l'inactivité, en millisecondes. */
export const IDLE_CHECK_MS = 15_000;

/**
 * Verrouille la session quand le membre est resté inactif trop longtemps,
 * vérifié régulièrement et au retour de l'application au premier plan.
 */
function lockWhenIdle(): void {
  const { lastActivity } = useActivityStore.getState();
  const { minutes } = useAutoLockStore.getState();
  if (isIdleTooLong({ lastActivity, now: Date.now(), minutes })) useSessionStore.getState().lock();
}

/**
 * Surveille l'inactivité d'une session ouverte et non verrouillée : après la
 * durée réglée dans le profil (5 minutes par défaut), la session se
 * verrouille et ne demande plus que le code PIN.
 */
export function useAutoLock(): void {
  const active = useSessionStore((state) => state.signedIn && !state.locked);

  useEffect(() => {
    if (!active) return undefined;
    useActivityStore.getState().touch();
    const timer = setInterval(lockWhenIdle, IDLE_CHECK_MS);
    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") lockWhenIdle();
    });

    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [active]);
}
