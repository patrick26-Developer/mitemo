/**
 * Couleurs passées aux APIs qui n'acceptent pas de classe Tailwind : `color`
 * d'une icône, `stroke`/`stopColor` du SVG, valeur animée par Reanimated.
 *
 * `global.css` (`@theme`) reste la source des couleurs employées par les
 * `className`. Quand une même couleur sert des deux côtés (encre, bleu de
 * marque), elle figure dans les deux fichiers et se retouche aux deux.
 */
export const PALETTE = {
  brand: "#083EDF",
  ink: "#0E1423",
  tabInk: "#0B1B33",
  tabActive: "#DEECF7",
  muted: "#4A5168",
  white: "#FFFFFF",
  onDarkFaint: "rgba(255,255,255,0.6)",
  barcodeOnBrand: "rgba(255,255,255,0.35)",
  barcodeOnCard: "rgba(23,27,42,0.35)",
  barcodeOnSavings: "rgba(225,228,238,0.35)",
} as const;
