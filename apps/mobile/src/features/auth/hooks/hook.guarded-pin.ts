import { useCallback } from "react";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { PIN_AUTH_DEPS } from "../api/deps.pin-auth";
import { checkPin } from "../model/model.pin-auth";
import { failedPinMessage, isSuspended } from "../model/model.pin-attempts";
import { usePinAttemptsStore } from "../model/store.pin-attempts";

/**
 * Vérifie le code PIN d'un numéro en comptant les échecs : chaque code
 * incorrect annonce en toast les essais restants ; au dernier, le compte est
 * suspendu et la saisie disparaît.
 * @param phone Numéro du compte.
 * @returns La vérification et la suspension du compte.
 */
export function useGuardedPinCheck(phone: string) {
  const suspended = usePinAttemptsStore((state) => isSuspended(state.failures[phone] ?? 0));
  const verify = useCallback(
    async (pin: string) => {
      const accepted = await checkPin({ phone, pin }, PIN_AUTH_DEPS);
      const attempts = usePinAttemptsStore.getState();
      if (accepted) attempts.clear(phone);
      else useToastStore.getState().show("error", failedPinMessage(attempts.recordFailure(phone)));
      return accepted;
    },
    [phone],
  );

  return { verify, suspended };
}
