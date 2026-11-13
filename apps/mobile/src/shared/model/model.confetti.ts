/** Couleurs des confettis : la marque, puis des teintes des tontines. */
export const CONFETTI_COLORS = [
  "#083EDF",
  "#2CCA86",
  "#F5B94A",
  "#F2A0B5",
  "#A78BFA",
  "#5EB8F2",
] as const;

/** Un confetti et sa chute. */
export interface ConfettiPiece {
  /** Position de départ, en fraction de la largeur de l'écran (0 à gauche). */
  readonly x: number;
  /** Attente avant la chute, en millisecondes. */
  readonly delay: number;
  /** Durée de la chute, en millisecondes. */
  readonly duration: number;
  /** Déplacement latéral pendant la chute, en points. */
  readonly drift: number;
  /** Tours sur lui-même pendant la chute, en degrés. */
  readonly spin: number;
  /** Largeur, en points ; la hauteur en est la moitié ou l'égale. */
  readonly width: number;
  readonly square: boolean;
  readonly color: (typeof CONFETTI_COLORS)[number];
}

/** Salve à tirer. */
export interface ConfettiRequest {
  readonly count: number;
  /** Graine du tirage : la même graine donne la même salve. */
  readonly seed: number;
}

/**
 * Générateur pseudo-aléatoire « mulberry32 », pour un tirage reproductible.
 * @param seed Graine du tirage.
 * @returns Une fonction qui rend un nombre de [0, 1).
 */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Tire un confetti.
 * @param random Tirage pseudo-aléatoire.
 * @returns Le confetti.
 */
function drawPiece(random: () => number): ConfettiPiece {
  const direction = random() < 0.5 ? -1 : 1;

  return {
    x: random(),
    delay: Math.round(random() * 400),
    duration: 1800 + Math.round(random() * 1000),
    drift: direction * (20 + random() * 60),
    spin: direction * (180 + random() * 540),
    width: 6 + Math.floor(random() * 3) * 2,
    square: random() < 0.3,
    color: CONFETTI_COLORS[Math.floor(random() * CONFETTI_COLORS.length)] ?? CONFETTI_COLORS[0],
  };
}

/**
 * Tire une salve de confettis qui tombent du haut de l'écran.
 * @param request Nombre de confettis et graine.
 * @returns Les confettis de la salve.
 */
export function confettiPieces(request: ConfettiRequest): readonly ConfettiPiece[] {
  const random = seededRandom(request.seed);

  return Array.from({ length: request.count }, () => drawPiece(random));
}
