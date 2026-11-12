import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { SeenIds, SeenScope } from "./model.notification-badges";

/** Nombre d'identifiants gardés par liste sur l'appareil, les plus récents. */
const MAX_IDS = 300;

/** Notifications ouvertes, notifications vues à chaque endroit, et leurs gestes. */
export interface NotificationMarksState {
  /** Notifications touchées : elles perdent leur fond « non lue ». */
  readonly readIds: readonly string[];
  /** Notifications vues à chaque endroit : elles ne comptent plus dans sa pastille. */
  readonly seen: SeenIds;
  markRead(id: string): void;
  markSeen(scope: SeenScope, ids: readonly string[]): void;
}

/** Clé de persistance des marques de notifications sur l'appareil. */
export const NOTIFICATION_MARKS_STORAGE_KEY = "mitemo-notification-marks";

/**
 * Ajoute des identifiants en tête d'une liste, sans doublon ni débordement.
 * @param list Liste actuelle.
 * @param ids Identifiants à ajouter.
 * @returns La liste mise à jour, ou `null` quand rien n'est nouveau.
 */
function withIds(list: readonly string[], ids: readonly string[]): readonly string[] | null {
  const fresh = ids.filter((id) => !list.includes(id));
  return fresh.length === 0 ? null : [...fresh, ...list].slice(0, MAX_IDS);
}

/**
 * Marques des notifications, conservées sur l'appareil : une notification
 * touchée est lue ; une notification vue (feuille ouverte, onglet visité) ne
 * compte plus dans la pastille de cet endroit.
 */
export const useNotificationMarksStore = create<NotificationMarksState>()(
  persist(
    (set) => ({
      readIds: [],
      seen: { bell: [], tontines: [], savings: [] },
      markRead: (id) =>
        set((state) => {
          const readIds = withIds(state.readIds, [id]);
          return readIds === null ? state : { readIds };
        }),
      markSeen: (scope, ids) =>
        set((state) => {
          const next = withIds(state.seen[scope], ids);
          return next === null ? state : { seen: { ...state.seen, [scope]: next } };
        }),
    }),
    {
      name: NOTIFICATION_MARKS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ readIds: state.readIds, seen: state.seen }),
    },
  ),
);
