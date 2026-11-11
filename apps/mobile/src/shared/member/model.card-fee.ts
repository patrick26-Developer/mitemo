/** Part de l'objectif prélevée par Mitemo à la création d'une carte, en pourcentage. */
export const CARD_FEE_PERCENT = 10n;

/**
 * Calcule les frais Mitemo d'une carte : 10 % de l'objectif, arrondis au franc
 * inférieur, en entiers pour ne jamais passer par un flottant.
 * @param goal Objectif de la carte, en plus petite unité de la devise.
 * @returns Les frais dus à la création.
 */
export function cardCreationFee(goal: bigint): bigint {
  return (goal * CARD_FEE_PERCENT) / 100n;
}
