import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AutoLockMinutes } from "./model.auto-lock";
import { DEFAULT_AUTO_LOCK_MINUTES } from "./model.auto-lock";

/** Durée d'inactivité avant le verrouillage, réglée dans le profil. */
export interface AutoLockState {
  readonly minutes: AutoLockMinutes;
  /** Change la durée d'inactivité tolérée. */
  setMinutes: (minutes: AutoLockMinutes) => void;
}

/** Clé de stockage du réglage sur l'appareil. */
export const AUTO_LOCK_STORAGE_KEY = "mitemo-auto-lock";

/** Réglage du verrouillage automatique, gardé sur l'appareil. */
export const useAutoLockStore = create<AutoLockState>()(
  persist(
    (set) => ({
      minutes: DEFAULT_AUTO_LOCK_MINUTES,
      setMinutes: (minutes) => set({ minutes }),
    }),
    { name: AUTO_LOCK_STORAGE_KEY, storage: createJSONStorage(() => AsyncStorage) },
  ),
);
