import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Codes incorrects par numéro, et leur suivi. */
export interface PinAttemptsState {
  /** Codes incorrects saisis depuis le dernier code juste, par numéro. */
  readonly failures: Readonly<Record<string, number>>;
  /** Compte un code incorrect et renvoie le total pour ce numéro. */
  recordFailure: (phone: string) => number;
  /** Oublie les échecs d'un numéro, après un code juste. */
  clear: (phone: string) => void;
}

/** Clé de stockage des échecs sur l'appareil. */
export const PIN_ATTEMPTS_STORAGE_KEY = "mitemo-pin-attempts";

/**
 * Échecs du code PIN, gardés sur l'appareil : relancer l'application ou
 * changer de compte ne rend pas les essais perdus.
 */
export const usePinAttemptsStore = create<PinAttemptsState>()(
  persist(
    (set, get) => ({
      failures: {},
      recordFailure: (phone) => {
        const total = (get().failures[phone] ?? 0) + 1;
        set({ failures: { ...get().failures, [phone]: total } });
        return total;
      },
      clear: (phone) => {
        set({
          failures: Object.fromEntries(
            Object.entries(get().failures).filter(([known]) => known !== phone),
          ),
        });
      },
    }),
    { name: PIN_ATTEMPTS_STORAGE_KEY, storage: createJSONStorage(() => AsyncStorage) },
  ),
);
