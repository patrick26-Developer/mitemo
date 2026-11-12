/** Tranche de montant de pointage et sa teinte. */
export interface CardTintBand {
  /** Montant minimal d'un pointage dans la tranche, en FCFA entiers, inclus. */
  readonly from: bigint;
  readonly tint: string;
}

/**
 * Teintes des cartes de pointage par montant d'un pointage : cinq tranches,
 * assez pour distinguer les petites épargnes des grosses sans multiplier les
 * couleurs. Du plus petit au plus grand.
 */
export const CARD_TINT_BANDS: readonly CardTintBand[] = [
  { from: 0n, tint: "#CDF5DD" },
  { from: 1_000n, tint: "#CFD8FF" },
  { from: 6_000n, tint: "#F5D7B0" },
  { from: 20_000n, tint: "#F2C9E4" },
  { from: 50_000n, tint: "#E2D6FF" },
];

/**
 * Teinte d'une carte selon le montant de son pointage : moins de 1 000,
 * 1 000 à 5 999, 6 000 à 19 999, 20 000 à 49 999, puis 50 000 FCFA et plus.
 * @param markerAmount Montant d'un pointage, en FCFA entiers.
 * @returns La teinte de la carte.
 */
export function cardTintFor(markerAmount: bigint): string {
  const band = CARD_TINT_BANDS.filter((entry) => markerAmount >= entry.from).at(-1);
  return band?.tint ?? "#CDF5DD";
}
