import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Présentation de l'application et action qui la clôt. */
export interface OnboardingState {
  /** Vrai une fois la présentation vue ou passée : elle ne revient plus. */
  readonly completed: boolean;
  complete(): void;
}

/** Clé de persistance de la présentation sur l'appareil. */
export const ONBOARDING_STORAGE_KEY = "mitemo-onboarding";

/**
 * Présentation de l'application, montrée une seule fois au premier
 * lancement. L'état est conservé sur l'appareil ; une déconnexion ne la fait
 * pas revenir.
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      complete: () => set({ completed: true }),
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ completed: state.completed }),
    },
  ),
);
