import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Retours sensibles que le membre peut couper depuis son profil. */
export const FEEDBACK_KEYS = ["sound", "confetti", "vibration", "animations"] as const;

/** Un retour sensible. Voir {@link FEEDBACK_KEYS}. */
export type FeedbackKey = (typeof FEEDBACK_KEYS)[number];

/** Libellé et explication d'un retour, pour la page profil. */
export interface FeedbackOption {
  readonly key: FeedbackKey;
  readonly label: string;
  readonly description: string;
}

/** Retours proposés, dans l'ordre de la page profil. */
export const FEEDBACK_OPTIONS: readonly FeedbackOption[] = [
  { key: "sound", label: "Sons", description: "Un son à chaque réussite" },
  { key: "confetti", label: "Confettis", description: "Une pluie de confettis à chaque réussite" },
  { key: "vibration", label: "Vibrations", description: "Une vibration brève à chaque réussite" },
  {
    key: "animations",
    label: "Animations",
    description: "Transitions et mouvements de l'interface",
  },
];

/** Retours activés : `true` pour chaque retour joué. */
export type FeedbackPreferences = Readonly<Record<FeedbackKey, boolean>>;

/** Préférences et leur réglage. */
export interface FeedbackPreferencesState extends FeedbackPreferences {
  /** Coupe ou rallume un retour. */
  toggle: (key: FeedbackKey) => void;
}

/** Tous les retours sont activés par défaut. */
export const INITIAL_FEEDBACK_PREFERENCES: FeedbackPreferences = {
  sound: true,
  confetti: true,
  vibration: true,
  animations: true,
};

/** Clé de stockage des préférences sur l'appareil. */
export const FEEDBACK_STORAGE_KEY = "mitemo-feedback-preferences";

/** Préférences de retour du membre, gardées sur l'appareil. */
export const useFeedbackPreferences = create<FeedbackPreferencesState>()(
  persist(
    (set) => ({
      ...INITIAL_FEEDBACK_PREFERENCES,
      toggle: (key) => set((state) => ({ [key]: !state[key] })),
    }),
    { name: FEEDBACK_STORAGE_KEY, storage: createJSONStorage(() => AsyncStorage) },
  ),
);
