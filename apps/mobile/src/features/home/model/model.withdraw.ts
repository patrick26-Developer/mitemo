import type { FormResult } from "../../../shared/model/model.form-result";
import { formError, formOk } from "../../../shared/model/model.form-result";
import { parseAmountInput } from "../../../shared/model/model.amount-input";

/** Opérateurs vers lesquels on retire le solde. */
export const WITHDRAW_METHODS = ["MTN_MOMO", "AIRTEL_MONEY"] as const;

/** Opérateur d'un retrait. Voir {@link WITHDRAW_METHODS}. */
export type WithdrawMethod = (typeof WITHDRAW_METHODS)[number];

/**
 * Valide le montant d'un retrait : un montant entier positif, couvert par le
 * solde disponible.
 * @param text Montant saisi, en FCFA ; les espaces de milliers sont tolérés.
 * @param available Solde disponible, en FCFA entiers.
 * @returns Le montant, ou le message à afficher.
 */
export function parseWithdrawAmount(text: string, available: bigint): FormResult<bigint> {
  const amount = parseAmountInput(text);
  if (amount === null || amount <= 0n) return formError("Saisissez le montant à retirer, en FCFA.");
  if (amount > available) return formError("Votre solde disponible est insuffisant.");
  return formOk(amount);
}
