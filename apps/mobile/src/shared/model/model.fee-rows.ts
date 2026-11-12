import type { SheetRecapRow } from "../components/macros/sheet.recap";
import { formatAmount } from "../format/format.amount";
import { CARD_FEE_PERCENT } from "../member/model.card-fee";

/** Lignes d'un paiement frais compris, et son total. */
export interface FeeRows {
  readonly rows: readonly SheetRecapRow[];
  /** Montant plus frais, en plus petite unité de la devise. */
  readonly total: bigint;
}

/**
 * Détaille un paiement frais compris : le montant, les frais Mitemo, puis le
 * total que le membre règle.
 * @param label Libellé du montant, par exemple « Cotisation ».
 * @param amount Montant hors frais, en plus petite unité de la devise.
 * @param fee Frais Mitemo, en plus petite unité de la devise.
 * @returns Les trois lignes du récapitulatif et le total.
 */
export function feeRows(label: string, amount: bigint, fee: bigint): FeeRows {
  const total = amount + fee;
  const fcfa = (value: bigint) => `${formatAmount(value)} FCFA`;

  return {
    rows: [
      { label, value: fcfa(amount) },
      { label: `Frais Mitemo (${CARD_FEE_PERCENT} %)`, value: fcfa(fee) },
      { label: "Total", value: fcfa(total) },
    ],
    total,
  };
}
