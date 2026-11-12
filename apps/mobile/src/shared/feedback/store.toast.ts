import { create } from "zustand";

import type { FeedbackKind } from "../components/atoms/banner.feedback";

/** Toast affiché en haut de l'écran. */
export interface Toast {
  /** Change à chaque affichage, pour relancer l'animation et le minuteur. */
  readonly id: number;
  readonly kind: FeedbackKind;
  readonly message: string;
}

/** État des toasts : un seul à la fois, le plus récent. */
export interface ToastState {
  readonly toast: Toast | null;
  show: (kind: FeedbackKind, message: string) => void;
  dismiss: () => void;
}

/**
 * Toasts de l'application : chaque succès ou erreur d'une opération sort en
 * haut de l'écran, comme une notification, puis disparaît de lui-même.
 */
export const useToastStore = create<ToastState>()((set, get) => ({
  toast: null,
  show: (kind, message) => set({ toast: { id: (get().toast?.id ?? 0) + 1, kind, message } }),
  dismiss: () => set({ toast: null }),
}));
