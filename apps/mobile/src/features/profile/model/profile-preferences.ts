import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ProfileLanguage, ProfileTheme } from "./profile-content";

/** Notifications que le membre peut activer ou couper. */
export const NOTIFICATION_KEYS = ["contributions", "rounds", "announcements"] as const;

/** Clé d'une notification. Voir {@link NOTIFICATION_KEYS}. */
export type NotificationKey = (typeof NOTIFICATION_KEYS)[number];

/** Notification proposée dans les préférences, avec son libellé. */
export interface NotificationOption {
  readonly key: NotificationKey;
  readonly label: string;
  readonly description: string;
}

/** Notifications affichées dans la feuille des préférences. */
export const NOTIFICATION_OPTIONS: readonly NotificationOption[] = [
  { key: "contributions", label: "Cotisations", description: "Rappels avant chaque échéance" },
  { key: "rounds", label: "Tours de tontine", description: "Quand votre tour approche" },
  { key: "announcements", label: "Annonces", description: "Nouveautés et conseils Mitemo" },
];

/** Préférences du membre, conservées sur l'appareil. */
export interface ProfilePreferences {
  readonly theme: ProfileTheme;
  readonly language: ProfileLanguage;
  readonly notifications: Readonly<Record<NotificationKey, boolean>>;
  readonly biometrics: boolean;
  /** Identifiant du moyen de paiement principal. */
  readonly primaryPaymentId: string;
}

/** Préférences et actions qui les modifient. */
export interface ProfilePreferencesState extends ProfilePreferences {
  /** Change le thème affiché par le profil. */
  setTheme: (theme: ProfileTheme) => void;
  /** Change la langue affichée par le profil. */
  setLanguage: (language: ProfileLanguage) => void;
  /** Active ou coupe une catégorie de notifications. */
  toggleNotification: (key: NotificationKey) => void;
  /** Active ou coupe le déverrouillage biométrique. */
  setBiometrics: (enabled: boolean) => void;
  /** Choisit le moyen de paiement principal. */
  setPrimaryPayment: (id: string) => void;
}

/** Préférences par défaut, alignées sur le thème automatique de l'application. */
export const INITIAL_PROFILE_PREFERENCES: ProfilePreferences = {
  theme: "Système",
  language: "Français",
  notifications: { contributions: true, rounds: true, announcements: false },
  biometrics: false,
  primaryPaymentId: "airtel",
};

/** Clé de persistance des préférences. */
export const PREFERENCES_STORAGE_KEY = "mitemo-profile-preferences";

/**
 * Préférences du profil : thème, langue, notifications et biométrie. Elles
 * survivent aux redémarrages, comme la photo.
 */
export const useProfilePreferences = create<ProfilePreferencesState>()(
  persist(
    (set) => ({
      ...INITIAL_PROFILE_PREFERENCES,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotification: (key) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: !state.notifications[key] },
        })),
      setBiometrics: (biometrics) => set({ biometrics }),
      setPrimaryPayment: (primaryPaymentId) => set({ primaryPaymentId }),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
