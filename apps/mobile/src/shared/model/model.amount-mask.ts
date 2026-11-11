/** Glyphes utilisés pour masquer un montant, sans jamais afficher de point. */
const MASK_GLYPHS = ["#", "%", "&", "@", "$", "?", "*", "+", "=", "~"] as const;

/**
 * Choisit le glyphe d'un chiffre.
 * @param index Position du chiffre dans le montant.
 * @returns Le glyphe correspondant.
 */
function glyphAt(index: number): string {
  return MASK_GLYPHS[index % MASK_GLYPHS.length] ?? "#";
}

/**
 * Masque un montant déjà formaté : chaque chiffre devient un glyphe, les
 * espaces de milliers sont conservés pour que la largeur du texte ne saute pas.
 * Le résultat est déterministe pour un même montant.
 * @param formatted Montant lisible, par exemple « 12 500 ».
 * @returns Le montant masqué, par exemple « #% &@# ».
 */
export function maskAmountText(formatted: string): string {
  return Array.from(formatted)
    .map((char, index) => (char >= "0" && char <= "9" ? glyphAt(Number(char) + index) : char))
    .join("");
}
