/** Entier strictement positif, sans signe ni séparateur. */
const COUNT_INPUT = /^[1-9]\d*$/;

/**
 * Lit un entier positif saisi au clavier.
 * @param text Texte saisi.
 * @param max Borne haute acceptée.
 * @returns L'entier, ou `null` si la saisie est vide, non numérique ou hors bornes.
 */
export function parseCountInput(text: string, max: number): number | null {
  const trimmed = text.trim();
  if (!COUNT_INPUT.test(trimmed)) return null;

  const value = Number(trimmed);
  return value <= max ? value : null;
}
