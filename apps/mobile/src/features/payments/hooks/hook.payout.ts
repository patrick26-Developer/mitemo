import { useState } from "react";

import type { PaymentMethod } from "../../../shared/model/model.payment-method";

/** Moyen choisi et actions de la feuille de retrait. */
export interface PayoutState {
  /** Moyen choisi, en attente du code PIN ; `null` tant qu'il est à choisir. */
  readonly method: PaymentMethod | null;
  readonly choose: (method: PaymentMethod) => void;
  /** Retire vers le moyen choisi, une fois le code PIN reconnu, puis ferme. */
  readonly confirm: () => void;
  readonly close: () => void;
}

/**
 * Retrait en deux temps : le moyen, puis le code PIN. Fermer repart du choix.
 * @param onPayout Retrait vers le moyen choisi.
 * @param onClose Fermeture de la feuille.
 * @returns Le moyen choisi et les actions.
 */
export function usePayout(
  onPayout: (method: PaymentMethod) => void,
  onClose: () => void,
): PayoutState {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const close = () => {
    setMethod(null);
    onClose();
  };
  const confirm = () => {
    if (method !== null) onPayout(method);
    close();
  };

  return { method, choose: setMethod, confirm, close };
}
