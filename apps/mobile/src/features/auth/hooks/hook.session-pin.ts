import { useMemberStore } from "../../../shared/member/store.member";
import { PIN_AUTH_DEPS } from "../api/deps.pin-auth";
import { checkDevicePin } from "../model/model.pin-auth";
import { useGuardedPinCheck } from "./hook.guarded-pin";

/**
 * Vérifie le code du compte de l'appareil.
 * @param pin Code saisi.
 * @returns `true` quand le code est juste.
 */
function checkSessionPin(pin: string): Promise<boolean> {
  return checkDevicePin(pin, PIN_AUTH_DEPS);
}

/**
 * Vérifie le code PIN pendant une session ouverte (verrou, confirmation d'un
 * paiement, changement de code), contre le compte de l'appareil et non le
 * numéro du profil, en comptant les échecs.
 * @returns La vérification et la suspension du compte.
 */
export function useSessionPinCheck() {
  return useGuardedPinCheck(
    useMemberStore((state) => state.phone),
    checkSessionPin,
  );
}
