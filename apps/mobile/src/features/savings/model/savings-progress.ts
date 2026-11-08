/** Échelle entière du calcul, pour éviter les flottants sur des montants. */
const SCALE = 10_000n;

/**
 * Calcule la part épargnée d'une caisse.
 * @param current Montant épargné, en plus petite unité de la devise.
 * @param goal Objectif d'épargne, en plus petite unité de la devise.
 * @returns La part épargnée, bornée entre 0 et 1.
 */
export function savingsProgress(current: bigint, goal: bigint): number {
  if (goal <= 0n) return 0;

  const ratio = Number((current * SCALE) / goal) / Number(SCALE);
  return Math.min(Math.max(ratio, 0), 1);
}
