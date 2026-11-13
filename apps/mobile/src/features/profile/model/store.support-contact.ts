import type { SupportContactResponse } from "@mitemo/contracts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { SupportCache } from "./model.support-cache";

/** Cache du contact du service client. */
export interface SupportContactState {
  readonly cache: SupportCache | null;
  /** Garde le contact reçu du backend, daté de sa réception. */
  save: (response: SupportContactResponse, now: number) => void;
}

/**
 * Numéro du service client, gardé sur l'appareil pendant la durée fixée par
 * le backend : il reste joignable hors connexion.
 */
export const useSupportContactStore = create<SupportContactState>()(
  persist(
    (set) => ({
      cache: null,
      save: (response, now) => set({ cache: { ...response, fetchedAt: now } }),
    }),
    {
      name: "mitemo-support-contact",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ cache: state.cache }),
    },
  ),
);
