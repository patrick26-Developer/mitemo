import type { PaymentMethod } from "../../../shared/model/model.payment-method";

/**
 * Délai de la confirmation simulée, en millisecondes : le temps que le membre
 * valide sur son téléphone et que l'opérateur prévienne le serveur.
 */
export const SIMULATED_CONFIRMATION_MS = 6000;

/** Demande de paiement Mobile Money envoyée au serveur. */
export interface OperatorPaymentRequest {
  readonly method: Exclude<PaymentMethod, "MITEMO">;
  /** Montant demandé, en plus petite unité de la devise. */
  readonly amount: bigint;
}

/**
 * Attend que le serveur annonce la confirmation de l'opérateur : seul le
 * serveur, prévenu par MTN ou Airtel, peut dire qu'un paiement Mobile Money a
 * abouti ; le membre ne le déclare jamais lui-même. Tant que l'API n'est pas
 * branchée, la confirmation est simulée au bout d'un délai fixe.
 * @param request Opérateur et montant du paiement.
 * @param signal Annule l'attente quand le membre revient en arrière ou ferme.
 * @returns Une promesse résolue à la confirmation, jamais résolue si l'attente est annulée.
 */
export function awaitOperatorConfirmation(
  request: OperatorPaymentRequest,
  signal: AbortSignal,
): Promise<OperatorPaymentRequest> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(request), SIMULATED_CONFIRMATION_MS);
    signal.addEventListener("abort", () => clearTimeout(timer));
  });
}
