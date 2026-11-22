import { CARD_FEE_PERCENT } from "./model.card-fee";

/**
 * Part des frais Mitemo ajoutée à la cotisation d'un membre de tontine : 10 %
 * de sa cotisation. Chaque membre en paie autant, si bien que les frais du
 * tour font 10 % de ce qu'il réunit. Arrondie au franc inférieur.
 * @param due Cotisation du membre, en plus petite unité de la devise.
 * @returns Les frais à ajouter, en plus petite unité de la devise.
 */
export function contributionFee(due: bigint): bigint {
  return (due * CARD_FEE_PERCENT) / 100n;
}

/** Frais d'une carte et nombre de pointages sur lesquels les répartir. */
export interface CardFeePlan {
  /** Frais de la carte, 10 % de l'objectif, en plus petite unité de la devise. */
  readonly fee: bigint;
  readonly markersTotal: number;
}

/**
 * Part des frais d'une carte ajoutée à un pointage : les frais sont répartis
 * à parts égales, le reste au franc près sur les premiers pointages, de sorte
 * que la somme des parts fasse exactement les frais de la carte.
 * @param plan Frais de la carte et nombre de pointages.
 * @param index Rang du pointage, à partir de 0.
 * @returns Les frais du pointage, en plus petite unité de la devise ; 0 au-delà du dernier.
 */
export function markerFee(plan: CardFeePlan, index: number): bigint {
  if (index < 0 || index >= plan.markersTotal) return 0n;
  const count = BigInt(plan.markersTotal);
  const base = plan.fee / count;

  return BigInt(index) < plan.fee % count ? base + 1n : base;
}
