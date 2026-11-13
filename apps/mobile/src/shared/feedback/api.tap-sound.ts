import type { FeedbackSound } from "./api.feedback-effects";
import { playFeedbackSound } from "./api.feedback-effects";
import { useFeedbackPreferences } from "./store.feedback-preferences";

/**
 * Ajoute un son au toucher d'un bouton, comme dans un jeu : un « pop » pour
 * ajouter, un tintement pour cotiser ou pointer. Le son suit la préférence
 * « Sons » du profil ; l'action, elle, se lance toujours.
 * @param sound Son du bouton.
 * @param action Action du bouton.
 * @returns L'action, précédée de son son.
 */
export function withTapSound(sound: FeedbackSound, action: () => void): () => void {
  return () => {
    if (useFeedbackPreferences.getState().sound) void playFeedbackSound(sound);
    action();
  };
}
