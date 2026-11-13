import { create } from "zustand";

/** Dernier geste du membre, pour le verrouillage automatique. */
export interface ActivityState {
  /** Instant du dernier toucher, en millisecondes depuis l'époque Unix. */
  readonly lastActivity: number;
  /** Note un toucher du membre, à l'instant présent par défaut. */
  touch: (now?: number) => void;
}

/** Dernier geste du membre, sur un écran comme dans une feuille. */
export const useActivityStore = create<ActivityState>((set) => ({
  lastActivity: Date.now(),
  touch: (now = Date.now()) => set({ lastActivity: now }),
}));
