/** Distance de glissement, en points, au-delà de laquelle la feuille se ferme. */
export const SHEET_DISMISS_DISTANCE = 120;

/** Vitesse de glissement, en points par milliseconde, qui ferme la feuille. */
export const SHEET_DISMISS_VELOCITY = 0.8;

/**
 * Indique si un glissement vers le bas doit fermer la feuille.
 * @param translationY Distance parcourue vers le bas, en points.
 * @param velocityY Vitesse du geste vers le bas, en points par milliseconde.
 * @returns Vrai si la feuille doit se fermer plutôt que revenir en place.
 */
export function shouldDismissSheet(translationY: number, velocityY: number): boolean {
  return translationY > SHEET_DISMISS_DISTANCE || velocityY > SHEET_DISMISS_VELOCITY;
}
