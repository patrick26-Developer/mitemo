/**
 * Double de test d'expo-haptics : le module natif n'existe pas dans Jest.
 */

/** Types de retour de notification, comme expo-haptics. */
export const NotificationFeedbackType = { Success: "success", Warning: "warning", Error: "error" };

/**
 * Retour haptique muet.
 * @returns {Promise<void>} Résolu aussitôt.
 */
export async function notificationAsync() {
  return undefined;
}
