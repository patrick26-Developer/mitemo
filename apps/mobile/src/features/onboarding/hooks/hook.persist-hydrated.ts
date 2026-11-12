import { useSyncExternalStore } from "react";

/** Partie de l'API `persist` de zustand qui renseigne sur la relecture. */
export interface PersistHydration {
  hasHydrated(): boolean;
  onFinishHydration(listener: () => void): () => void;
}

/**
 * Indique si un store persistant a fini de relire ses données sur l'appareil,
 * pour ne pas décider d'un écran sur un état encore vide.
 * @param persistApi API `persist` du store.
 * @returns `true` une fois la relecture terminée.
 */
export function usePersistHydrated(persistApi: PersistHydration): boolean {
  return useSyncExternalStore(
    (listener) => persistApi.onFinishHydration(listener),
    () => persistApi.hasHydrated(),
  );
}
