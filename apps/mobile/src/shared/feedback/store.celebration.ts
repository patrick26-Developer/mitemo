import { create } from "zustand";

/** Salve de confettis en cours, identifiée pour relancer l'animation. */
export interface CelebrationBurst {
  readonly id: number;
}

/** État de la célébration affichée par-dessus toute l'application. */
export interface CelebrationState {
  readonly burst: CelebrationBurst | null;
  /** Lance une salve : création d'un compte, d'une tontine ou d'une carte. */
  celebrate: () => void;
  /** Efface la salve une fois jouée. */
  finish: () => void;
}

/** Célébration partagée, jouée par CelebrationHost à la racine. */
export const useCelebrationStore = create<CelebrationState>()((set, get) => ({
  burst: null,
  celebrate: () => set({ burst: { id: (get().burst?.id ?? 0) + 1 } }),
  finish: () => set({ burst: null }),
}));
