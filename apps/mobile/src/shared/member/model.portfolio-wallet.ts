import type { PortfolioContext, PortfolioState } from "./model.portfolio-actions";
import { requireFunds, requirePositive } from "./model.portfolio-update";

/**
 * Retire une partie du solde disponible vers l'opérateur mobile du membre.
 * @param context Accès au store.
 * @param amount Montant retiré, en FCFA entiers.
 * @throws {InvalidAmountError} si le montant n'est pas strictement positif.
 * @throws {InsufficientFundsError} si le solde disponible ne le couvre pas.
 */
function withdrawAvailable(context: PortfolioContext, amount: bigint): void {
  requirePositive(amount);
  requireFunds(context.get().available, amount);
  context.set((state) => ({ available: state.available - amount }));
}

/**
 * Opérations sur le solde disponible de la carte principale.
 * @param context Accès au store.
 * @returns Les opérations du solde.
 */
export function walletActions(
  context: PortfolioContext,
): Pick<PortfolioState, "withdrawAvailable"> {
  return { withdrawAvailable: (amount) => withdrawAvailable(context, amount) };
}
