import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  readonly notifications: Readonly<Record<NotificationKey, boolean>>;
  /** Identifiant du moyen de paiement principal. */
  readonly primaryPaymentId: string;
}

/** Préférences et actions qui les modifient. */
export interface ProfilePreferencesState extends ProfilePreferences {
  /** Active ou coupe une catégorie de notifications. */
  toggleNotification: (key: NotificationKey) => void;
  /** Choisit le moyen de paiement principal. */
  setPrimaryPayment: (id: string) => void;
}

/** Préférences par défaut. */
export const INITIAL_PROFILE_PREFERENCES: ProfilePreferences = {
  notifications: { contributions: true, rounds: true, announcements: false },
  primaryPaymentId: "airtel",
};

/** Clé de persistance des préférences. */
export const PREFERENCES_STORAGE_KEY = "mitemo-profile-preferences";

/** Version du format enregistré : la version 1 retire le thème, la langue et la biométrie. */
const PREFERENCES_VERSION = 1;

/**
 * Ne garde des préférences relues que les champs encore pris en charge.
 * @param persisted Préférences relues, d'une version quelconque.
 * @returns Les préférences connues, complétées par les valeurs par défaut.
 */
function migratePreferences(persisted: unknown): ProfilePreferences {
  const stored = (typeof persisted === "object" && persisted !== null ? persisted : {}) as Partial<
    Record<keyof ProfilePreferences, unknown>
  >;
  const pick = <K extends keyof ProfilePreferences>(key: K): ProfilePreferences[K] =>
    (stored[key] as ProfilePreferences[K] | undefined) ?? INITIAL_PROFILE_PREFERENCES[key];

  return {
    notifications: pick("notifications"),
    primaryPaymentId: pick("primaryPaymentId"),
  };
}

/**
 * Préférences du profil : notifications et moyen de paiement.
 * Elles survivent aux redémarrages, comme la photo.
 */
export const useProfilePreferences = create<ProfilePreferencesState>()(
  persist(
    (set) => ({
      ...INITIAL_PROFILE_PREFERENCES,
      toggleNotification: (key) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: !state.notifications[key] },
        })),
      setPrimaryPayment: (primaryPaymentId) => set({ primaryPaymentId }),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      version: PREFERENCES_VERSION,
      migrate: migratePreferences,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
