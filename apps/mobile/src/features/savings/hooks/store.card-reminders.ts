import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Rappels de carte déjà envoyés, pour n'en notifier aucun deux fois. */
export interface CardReminderState {
  /** Identifiants des rappels déjà affichés sur le téléphone. */
  readonly sentIds: readonly string[];
  markSent: (id: string) => void;
}

/** Clé de persistance des rappels envoyés. */
export const CARD_REMINDER_STORAGE_KEY = "mitemo-card-reminders";

/**
 * Mémorise les rappels déjà envoyés, même après un redémarrage : un rappel ne
 * revient qu'au tour suivant, sous un nouvel identifiant.
 */
export const useCardReminderStore = create<CardReminderState>()(
  persist(
    (set) => ({
      sentIds: [],
      markSent: (id) => set((state) => ({ sentIds: [...state.sentIds, id] })),
    }),
    { name: CARD_REMINDER_STORAGE_KEY, storage: createJSONStorage(() => AsyncStorage) },
  ),
);
