import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** État de confidentialité des montants, partagé par tous les écrans. */
export interface PrivacyState {
  /** `true` quand les montants sont masqués dans les lieux publics. */
  readonly amountsHidden: boolean;
  toggleAmounts: () => void;
}

/** Confidentialité au premier lancement : les montants sont visibles. */
export const INITIAL_PRIVACY = { amountsHidden: false } as const;

/** Clé de persistance du choix de confidentialité. */
export const PRIVACY_STORAGE_KEY = "mitemo-privacy";

/**
 * Mémorise le choix du membre de masquer ses montants. Le réglage survit au
 * redémarrage : une fois cachés, les montants le restent jusqu'au prochain appui.
 */
export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      amountsHidden: INITIAL_PRIVACY.amountsHidden,
      toggleAmounts: () => set((state) => ({ amountsHidden: !state.amountsHidden })),
    }),
    {
      name: PRIVACY_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
