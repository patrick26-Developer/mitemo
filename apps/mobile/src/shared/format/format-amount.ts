const THOUSANDS_SEPARATOR = /\B(?=(\d{3})+(?!\d))/g;

/**
 * Formate un montant en francs CFA avec une espace comme séparateur de milliers.
 * @param amount Montant en plus petite unité de la devise (franc CFA).
 * @returns Le montant lisible, par exemple « 12 500 ».
 */
export function formatAmount(amount: bigint): string {
  return amount.toString().replace(THOUSANDS_SEPARATOR, " ");
}
