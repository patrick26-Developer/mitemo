/** Côté de la tuile de bruit répétée, en points. */
export const NOISE_TILE_SIZE = 40;

/** Nombre de grains par tuile : assez pour un grain fin, sans alourdir le rendu. */
const NOISE_DOT_COUNT = 140;

/** Opacité maximale d'un grain, pour rester proche de la couleur du fond. */
const NOISE_MAX_OPACITY = 0.12;

/** Grain du motif de bruit. */
export interface NoiseDot {
  readonly x: number;
  readonly y: number;
  readonly color: "#FFFFFF" | "#000000";
  readonly opacity: number;
}

/**
 * Générateur pseudo-aléatoire déterministe (mulberry32) : le même motif à
 * chaque rendu et dans les tests.
 * @param seed Graine du tirage.
 * @returns Un tirage entre 0 et 1 à chaque appel.
 */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Tire les grains d'une tuile de bruit : des points clairs et sombres très
 * discrets, qui donnent une texture proche de la couleur du fond.
 * @param seed Graine du tirage.
 * @returns Les grains de la tuile.
 */
export function noiseDots(seed: number): readonly NoiseDot[] {
  const random = seededRandom(seed);

  return Array.from({ length: NOISE_DOT_COUNT }, () => ({
    x: Math.floor(random() * NOISE_TILE_SIZE),
    y: Math.floor(random() * NOISE_TILE_SIZE),
    color: random() < 0.5 ? ("#FFFFFF" as const) : ("#000000" as const),
    opacity: Math.max(0.02, random() * NOISE_MAX_OPACITY),
  }));
}
