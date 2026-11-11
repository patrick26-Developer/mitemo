import { PALETTE } from "../theme/theme.palette";

/** Couleur RVB, chaque canal entre 0 et 1. */
type Rgb = readonly [number, number, number];

/** Couleur TSL : teinte, saturation et luminosité, chacune entre 0 et 1. */
type Hsl = readonly [number, number, number];

/** Couleurs d'une action teintée : fond foncé et texte lisible dessus. */
export interface AccentColors {
  /** Fond de l'action, en hexadécimal `#RRGGBB`. */
  readonly background: string;
  /** Texte ou icône posé sur le fond, en hexadécimal `#RRGGBB`. */
  readonly foreground: string;
}

/** Luminosité du fond foncé : assez sombre pour se détacher sur le blanc. */
const ACCENT_LIGHTNESS = 0.5;

/** Saturation maximale du fond, pour éviter une couleur criarde. */
const ACCENT_MAX_SATURATION = 0.75;

/**
 * Lit une couleur hexadécimale.
 * @param hex Couleur au format `#RRGGBB`.
 * @returns Ses trois canaux, entre 0 et 1.
 */
function toRgb(hex: string): Rgb {
  const channel = (start: number) => parseInt(hex.slice(start, start + 2), 16) / 255;
  return [channel(1), channel(3), channel(5)];
}

/**
 * Écrit une couleur en hexadécimal.
 * @param rgb Canaux entre 0 et 1.
 * @returns La couleur au format `#RRGGBB`, en majuscules.
 */
function toHex(rgb: Rgb): string {
  const channel = (value: number) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${rgb.map(channel).join("")}`.toUpperCase();
}

/**
 * Calcule la teinte d'une couleur à partir de son canal dominant.
 * @param rgb Canaux entre 0 et 1, non tous égaux.
 * @returns La teinte, entre 0 et 1.
 */
function hue(rgb: Rgb): number {
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  if (max === r) return ((g - b) / delta + (g < b ? 6 : 0)) / 6;
  if (max === g) return ((b - r) / delta + 2) / 6;
  return ((r - g) / delta + 4) / 6;
}

/**
 * Convertit une couleur RVB en TSL.
 * @param rgb Canaux entre 0 et 1.
 * @returns Teinte, saturation et luminosité.
 */
function toHsl(rgb: Rgb): Hsl {
  const max = Math.max(...rgb);
  const min = Math.min(...rgb);
  const lightness = (max + min) / 2;
  if (max === min) return [0, 0, lightness];

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  return [hue(rgb), saturation, lightness];
}

/**
 * Calcule un canal RVB à partir de sa position sur le cercle des teintes.
 * @param p Borne basse.
 * @param q Borne haute.
 * @param position Position sur le cercle, décalée selon le canal.
 * @returns Le canal, entre 0 et 1.
 */
function hueChannel(p: number, q: number, position: number): number {
  const t = (position + 1) % 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/**
 * Convertit une couleur TSL en RVB.
 * @param hsl Teinte, saturation et luminosité.
 * @returns Canaux entre 0 et 1.
 */
function toRgbFromHsl(hsl: Hsl): Rgb {
  const [h, s, l] = hsl;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hueChannel(p, q, h + 1 / 3), hueChannel(p, q, h), hueChannel(p, q, h - 1 / 3)];
}

/**
 * Luminance relative d'une couleur, au sens des WCAG 2.
 * @param hex Couleur au format `#RRGGBB`.
 * @returns La luminance, entre 0 (noir) et 1 (blanc).
 */
function luminance(hex: string): number {
  const linear = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = toRgb(hex);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/**
 * Rapport de contraste entre deux couleurs, au sens des WCAG 2.
 * @param first Première couleur, `#RRGGBB`.
 * @param second Seconde couleur, `#RRGGBB`.
 * @returns Le rapport, de 1 (aucun contraste) à 21 (noir sur blanc).
 */
export function contrastRatio(first: string, second: string): number {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

/**
 * Fonce la teinte claire d'une carte pour en faire une couleur d'action
 * accessible, et choisit dessus le texte le plus contrasté entre le blanc et
 * l'encre : le contraste atteint au moins 4,5:1 (WCAG AA) pour les teintes des cartes.
 * @param tint Teinte de la carte, `#RRGGBB`.
 * @returns Le fond de l'action et la couleur de son texte.
 */
export function accentColors(tint: string): AccentColors {
  const [h, s] = toHsl(toRgb(tint));
  const background = toHex(toRgbFromHsl([h, Math.min(s, ACCENT_MAX_SATURATION), ACCENT_LIGHTNESS]));
  const onWhite = contrastRatio(background, PALETTE.white);
  const onInk = contrastRatio(background, PALETTE.ink);
  return { background, foreground: onWhite >= onInk ? PALETTE.white : PALETTE.ink };
}

/** Baisse de luminosité d'une bordure posée sur sa propre couleur. */
const DARKEN_STEP = 0.12;

/**
 * Fonce légèrement une couleur sans changer sa teinte, par exemple pour
 * border un bandeau d'une nuance à peine plus sombre que son fond.
 * @param hex Couleur au format `#RRGGBB`.
 * @returns La couleur foncée, au format `#RRGGBB`.
 */
export function darkenColor(hex: string): string {
  const [h, s, l] = toHsl(toRgb(hex));
  return toHex(toRgbFromHsl([h, s, Math.max(l - DARKEN_STEP, 0)]));
}
