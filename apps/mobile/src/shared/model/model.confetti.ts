/** Couleurs des confettis : la marque, puis des teintes des tontines. */
export const CONFETTI_COLORS = [
  "#083EDF",
  "#2CCA86",
  "#F5B94A",
  "#F2A0B5",
  "#A78BFA",
  "#5EB8F2",
] as const;

/** Billets stylisés (pas de vrais billets) : vert, bleu et brun, pour rappeler l'argent liquide. */
export const BILL_COLORS = ["#3FA36B", "#4F7FD9", "#B9774A"] as const;

/** Pièces : l'or et l'argent. */
export const COIN_COLORS = ["#F5B94A", "#C9CED8"] as const;

/** Natures de confettis : un papier coloré, une pièce ou un billet. */
export const CONFETTI_KINDS = ["paper", "coin", "bill"] as const;

/** Nature d'un confetti. Voir {@link CONFETTI_KINDS}. */
export type ConfettiKind = (typeof CONFETTI_KINDS)[number];

/** Forme d'un confetti, sans sa chute. */
export interface ConfettiLook {
  readonly kind: ConfettiKind;
  /** Largeur, en points. */
  readonly width: number;
  /** Papier seulement : carré plutôt qu'en bande. */
  readonly square: boolean;
  readonly color: string;
}

/** Un confetti et sa chute. */
export interface ConfettiPiece extends ConfettiLook {
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
 * Choisit un élément au hasard dans une liste non vide.
 * @param items Liste.
 * @param random Tirage entre 0 et 1.
 * @returns L'élément tiré.
 */
function pick<T>(items: readonly [T, ...T[]], random: () => number): T {
  return items[Math.floor(random() * items.length)] ?? items[0];
}

/** Part cumulée de chaque nature : 40 % de billets, 30 % de pièces, le reste en papiers. */
const CONFETTI_KIND_SHARES: readonly { readonly kind: ConfettiKind; readonly upTo: number }[] = [
  { kind: "bill", upTo: 0.4 },
  { kind: "coin", upTo: 0.7 },
  { kind: "paper", upTo: 1 },
];

/** Tirage de l'apparence de chaque nature de confetti. */
const LOOK_DRAWERS: Readonly<Record<ConfettiKind, (random: () => number) => ConfettiLook>> = {
  bill: (random) => ({
    kind: "bill",
    width: 28 + Math.floor(random() * 9),
    square: false,
    color: pick(BILL_COLORS, random),
  }),
  coin: (random) => ({
    kind: "coin",
    width: 14 + Math.floor(random() * 7),
    square: false,
    color: pick(COIN_COLORS, random),
  }),
  paper: (random) => ({
    kind: "paper",
    width: 6 + Math.floor(random() * 3) * 2,
    square: random() < 0.3,
    color: pick(CONFETTI_COLORS, random),
  }),
};

/**
 * Tire la nature et l'apparence d'un confetti : 40 % de billets, 30 % de
 * pièces, 30 % de papiers.
 * @param random Tirage entre 0 et 1.
 * @returns L'apparence du confetti.
 */
function drawLook(random: () => number): ConfettiLook {
  const roll = random();
  const kind = CONFETTI_KIND_SHARES.find((share) => roll < share.upTo)?.kind ?? "paper";

  return LOOK_DRAWERS[kind](random);
}

/**
 * Tire un confetti : son apparence, puis sa chute. Un billet plane et
 * tournoie lentement ; une pièce ou un papier tourne vite.
 * @param random Tirage entre 0 et 1.
 * @returns Le confetti.
 */
function drawPiece(random: () => number): ConfettiPiece {
  const look = drawLook(random);
  const direction = random() < 0.5 ? -1 : 1;
  const spinRange = look.kind === "bill" ? 160 : 540;

  return {
    ...look,
    x: random(),
    delay: Math.round(random() * 600),
    duration: 1800 + Math.round(random() * 800),
    drift: direction * (20 + random() * (look.kind === "bill" ? 90 : 60)),
    spin: direction * (90 + random() * spinRange),
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

/** Style de la forme d'un confetti, sans position ni chute. */
export interface ConfettiShapeStyle {
  readonly width: number;
  readonly height: number;
  readonly borderRadius: number;
  readonly backgroundColor: string;
  readonly borderWidth: number;
  readonly borderColor: string;
}

/** Bord des billets et des pièces : un trait sombre qui les détache du fond. */
const MONEY_EDGE = "rgba(0,0,0,0.22)";

/**
 * Forme d'un confetti : bande ou carré de papier, pièce ronde cerclée, ou
 * billet deux fois plus large que haut.
 * @param look Apparence du confetti.
 * @returns Le style de sa forme.
 */
export function confettiShape(look: ConfettiLook): ConfettiShapeStyle {
  const base = { width: look.width, backgroundColor: look.color, borderColor: MONEY_EDGE };
  if (look.kind === "coin")
    return { ...base, height: look.width, borderRadius: look.width / 2, borderWidth: 2 };
  if (look.kind === "bill")
    return { ...base, height: look.width / 2, borderRadius: 3, borderWidth: 1 };

  return {
    ...base,
    height: look.square ? look.width : look.width / 2,
    borderRadius: 1.5,
    borderWidth: 0,
  };
}
