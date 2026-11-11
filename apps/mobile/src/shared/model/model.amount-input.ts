/** Montant entier strictement positif, sans signe ni séparateur. */
const AMOUNT_INPUT = /^[1-9]\d*$/;

/**
 * Lit un montant saisi au clavier, en francs CFA entiers.
 * @param text Texte saisi ; les espaces de milliers sont tolérés.
 * @returns Le montant en plus petite unité, ou `null` si la saisie est invalide.
 */
export function parseAmountInput(text: string): bigint | null {
  const compact = text.replace(/[\s\u00a0]/g, "");
  if (!AMOUNT_INPUT.test(compact)) return null;

  return BigInt(compact);
}
