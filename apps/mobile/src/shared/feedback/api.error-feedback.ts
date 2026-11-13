import { playErrorHaptic, playFeedbackSound } from "./api.feedback-effects";
import { useFeedbackPreferences } from "./store.feedback-preferences";

/**
 * Signale une erreur au membre : un son grave et une vibration d'erreur,
 * selon ses préférences « Sons » et « Vibrations ».
 */
export function signalError(): void {
  const { sound, vibration } = useFeedbackPreferences.getState();
  if (sound) void playFeedbackSound("error");
  if (vibration) void playErrorHaptic();
}
