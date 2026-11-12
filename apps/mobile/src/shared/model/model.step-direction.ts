/** Sens d'un passage d'étape : vers la suivante, ou retour à la précédente. */
export type StepDirection = "forward" | "back";

/**
 * Sens du passage d'une étape à l'autre, pour faire glisser la nouvelle
 * étape du bon côté : de la droite en avançant, de la gauche en revenant.
 * @param previous Étape quittée.
 * @param next Étape affichée.
 * @returns Le sens du passage.
 */
export function stepDirection(previous: number, next: number): StepDirection {
  return next < previous ? "back" : "forward";
}
