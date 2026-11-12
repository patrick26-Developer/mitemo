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

/** Décalage de départ d'une étape qui entre, en points : un geste court, pas un balayage d'écran. */
export const STEP_SLIDE_OFFSET = 24;

/** Échelle de départ d'une étape qui entre, pour une arrivée en douceur. */
const STEP_START_SCALE = 0.98;

/** Pose d'une étape à un instant de son entrée. */
export interface StepFrame {
  readonly opacity: number;
  readonly transform: readonly [{ readonly translateX: number }, { readonly scale: number }];
}

/** Début et fin de l'entrée d'une étape. */
export interface StepEnteringFrames {
  readonly from: StepFrame;
  readonly to: StepFrame;
}

/**
 * Poses de départ et d'arrivée d'une étape qui entre : elle part légèrement
 * décalée du côté d'où elle vient, transparente et un peu réduite, puis se
 * pose en place.
 * @param direction Sens du passage.
 * @returns Les poses de départ et d'arrivée.
 */
export function stepEnteringFrames(direction: StepDirection): StepEnteringFrames {
  const offset = direction === "forward" ? STEP_SLIDE_OFFSET : -STEP_SLIDE_OFFSET;

  return {
    from: { opacity: 0, transform: [{ translateX: offset }, { scale: STEP_START_SCALE }] },
    to: { opacity: 1, transform: [{ translateX: 0 }, { scale: 1 }] },
  };
}
