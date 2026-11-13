import { useCallback } from "react";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { PIN_AUTH_DEPS } from "../api/deps.pin-auth";
import { checkPin } from "../model/model.pin-auth";
import { failedPinMessage, isSuspended } from "../model/model.pin-attempts";
import { usePinAttemptsStore } from "../model/store.pin-attempts";

/** Vérification brute d'un code, sans compter les échecs. */
export type PinCheck = (pin: string) => Promise<boolean>;

/**
 * Vérifie le code PIN d'un numéro en comptant les échecs : chaque code
 * incorrect annonce en toast les essais restants ; au dernier, le compte est
 * suspendu et la saisie disparaît.
 * @param phone Numéro du compte, qui sert aussi de clé aux échecs.
 * @param check Vérification du code ; celle du numéro par défaut.
 * @returns La vérification et la suspension du compte.
 */
export function useGuardedPinCheck(phone: string, check?: PinCheck) {
  const suspended = usePinAttemptsStore((state) => isSuspended(state.failures[phone] ?? 0));
  const verify = useCallback(
    async (pin: string) => {
      const accepted = await (check ?? ((value) => checkPin({ phone, pin: value }, PIN_AUTH_DEPS)))(
        pin,
      );
      const attempts = usePinAttemptsStore.getState();
      if (accepted) attempts.clear(phone);
      else useToastStore.getState().show("error", failedPinMessage(attempts.recordFailure(phone)));
      return accepted;
    },
    [phone, check],
  );

  return { verify, suspended };
}
