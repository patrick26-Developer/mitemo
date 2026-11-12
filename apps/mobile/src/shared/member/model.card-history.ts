import type { PaymentMethod } from "../model/model.payment-method";
import type { SavingsCard } from "./model.portfolio";

/** Ligne de l'historique d'une carte : un pointage fait ou à venir. */
export interface CardHistoryRow {
  /** Rang du pointage, à partir de 1. */
  readonly position: number;
  readonly done: boolean;
  /** Instant du pointage en ISO 8601 UTC, `null` tant qu'il est à venir. */
  readonly at: string | null;
  /** Montant pointé, ou montant prévu pour un pointage à venir. */
  readonly amount: bigint;
  /** Opérateur qui a réglé le pointage, `null` tant qu'il est à venir. */
  readonly method: PaymentMethod | null;
}

/**
 * Liste tous les pointages d'une carte, cochés quand ils sont faits, avec leur
 * instant, leur montant et leur moyen de paiement, puis ceux qui restent à faire au montant prévu.
 * @param card Carte concernée.
 * @returns Une ligne par pointage, dans l'ordre.
 */
export function cardHistory(card: SavingsCard): readonly CardHistoryRow[] {
  const total = Math.max(card.markersTotal, card.entries.length);

  return Array.from({ length: total }, (_, index) => {
    const entry = card.entries[index];
    if (entry === undefined) {
      return {
        position: index + 1,
        done: false,
        at: null,
        amount: card.markerAmount,
        method: null,
      };
    }

    const { at, amount, method } = entry;
    return { position: index + 1, done: true, at, amount, method };
  });
}
