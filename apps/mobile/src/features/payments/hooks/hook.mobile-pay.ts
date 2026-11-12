import { useEffect, useEffectEvent, useState } from "react";

import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { awaitOperatorConfirmation } from "../api/api.operator-confirmation";
import type { PayStage } from "../model/model.pay-flow";
import { payStageFor } from "../model/model.pay-flow";

/** Options d'un paiement. */
export interface MobilePayOptions {
  /** Montant à payer, en plus petite unité de la devise. */
  readonly amount: bigint;
  /** Règle le montant par le moyen choisi. */
  readonly onPay: (method: PaymentMethod) => void;
  readonly onClose: () => void;
}

/** Attente d'une confirmation : étape, moyen, montant et validation. */
interface OperatorConfirmationOptions {
  readonly stage: PayStage;
  readonly method: PaymentMethod;
  /** Montant demandé, en plus petite unité de la devise. */
  readonly amount: bigint;
  readonly onConfirmed: () => void;
}

/**
 * Attend la confirmation du serveur pendant l'étape d'attente, puis valide le
 * paiement ; revenir en arrière ou fermer annule l'attente.
 * @param options Étape, moyen, montant et validation du paiement.
 */
function useOperatorConfirmation(options: OperatorConfirmationOptions): void {
  const { stage, method, amount } = options;
  const confirmed = useEffectEvent(options.onConfirmed);

  useEffect(() => {
    if (stage !== "pending" || method === "MITEMO") return undefined;
    const controller = new AbortController();
    void awaitOperatorConfirmation({ method, amount }, controller.signal).then(() => {
      if (!controller.signal.aborted) confirmed();
    });
    return () => controller.abort();
  }, [stage, method, amount]);
}

/**
 * Mène un paiement : le membre choisit un moyen. Avec MTN MoMo ou Airtel
 * Money, il valide sur son téléphone et le paiement aboutit quand le serveur le
 * confirme ; avec Mitemo, il saisit son code PIN. Revenir ou fermer ramène au
 * choix du moyen.
 * @param options Montant, paiement et fermeture.
 * @returns L'étape, le moyen choisi et les actions de la feuille.
 */
export function useMobilePay(options: MobilePayOptions) {
  const { amount, onPay, onClose } = options;
  const [stage, setStage] = useState<PayStage>("choose");
  const [method, setMethod] = useState<PaymentMethod>("MTN_MOMO");
  const choose = (next: PaymentMethod) => {
    setMethod(next);
    setStage(payStageFor(next));
  };
  const back = () => setStage("choose");
  const close = () => {
    back();
    onClose();
  };
  const confirm = () => {
    onPay(method);
    close();
  };
  useOperatorConfirmation({ stage, method, amount, onConfirmed: confirm });

  return { stage, method, choose, back, close, confirm };
}
