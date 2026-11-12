import type { MoneyDto } from "@mitemo/contracts";
import { formatAmount } from "../../../shared/format/format.amount";

/**
 * Formate un entier reçu sans perte de précision ni calcul de solde local.
 * @param money Montant validé par le schéma HTTP, en XAF.
 * @returns Le montant et sa devise.
 */
export function serverMoney(money: MoneyDto): string {
  return `${formatAmount(BigInt(money.amount))} ${money.currency}`;
}
