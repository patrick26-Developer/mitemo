import type { SheetRecapRow } from "../components/macros/sheet.recap";
import { formatAmount } from "../format/format.amount";

/** Ligne du montant à régler, et ce montant. */
export interface ChargeRow {
  readonly row: SheetRecapRow;
  /** Montant prélevé, frais compris, en plus petite unité de la devise. */
  readonly total: bigint;
}

/**
 * Montant à régler, frais compris, sur une seule ligne : les frais Mitemo
 * sont prélevés discrètement, une petite part à chaque paiement, sans ligne
 * à part qui inquiéterait le membre.
 * @param label Libellé du montant, par exemple « À régler ».
 * @param amount Montant hors frais, en plus petite unité de la devise.
 * @param fee Part des frais, en plus petite unité de la devise.
 * @returns La ligne et le montant prélevé.
 */
export function chargeRow(label: string, amount: bigint, fee: bigint): ChargeRow {
  const total = amount + fee;

  return { row: { label, value: `${formatAmount(total)} FCFA` }, total };
}
