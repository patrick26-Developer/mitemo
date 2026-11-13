/** Écart entre l'arrivée de deux formes du logo, en millisecondes. */
const LOGO_SHAPE_STAGGER_MS = 160;

/** Durée d'entrée d'une forme du logo, en millisecondes. */
export const LOGO_SHAPE_ENTER_MS = 560;

/**
 * Délai d'entrée d'une forme du logo : les trois formes se dessinent l'une
 * après l'autre, de gauche à droite.
 * @param index Rang de la forme, à partir de 0.
 * @returns Le délai, en millisecondes.
 */
export function logoShapeDelay(index: number): number {
  return index * LOGO_SHAPE_STAGGER_MS;
}

/** Délai d'apparition de la promesse et du nom en bas, une fois le logo posé, en millisecondes. */
export const WORDMARK_DELAY_MS = logoShapeDelay(2) + LOGO_SHAPE_ENTER_MS / 2;

/**
 * Images clés de l'entrée d'une forme : elle monte un peu, grandit au-delà
 * de sa taille puis s'y pose, comme un tampon.
 */
export const LOGO_SHAPE_FRAMES = {
  0: { opacity: 0, transform: [{ translateY: 18 }, { scale: 0.6 }] },
  60: { opacity: 1, transform: [{ translateY: -2 }, { scale: 1.06 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
} as const;
