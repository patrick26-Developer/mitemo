import { useState } from "react";

import type { FeedbackKind } from "../components/atoms/banner.feedback";

/** Message de retour d'une opération sur le portefeuille. */
export interface PortfolioFeedback {
  readonly kind: FeedbackKind;
  readonly message: string;
}

/** Message affiché quand une erreur inconnue remonte d'une opération. */
const UNKNOWN_ERROR = "L'opération n'a pas pu aboutir. Réessayez.";

/**
 * Traduit une erreur remontée par le portefeuille en message lisible.
 * @param error Erreur interceptée.
 * @returns Le message métier, ou un message générique.
 */
function describeError(error: unknown): string {
  return error instanceof Error && error.message !== "" ? error.message : UNKNOWN_ERROR;
}

/**
 * Exécute une opération du portefeuille et garde son retour à l'écran. Une
 * opération refusée par le modèle ne modifie pas l'état et affiche sa raison.
 * @returns Le retour courant et la fonction d'exécution, qui indique si l'opération a réussi.
 */
export function usePortfolioFeedback() {
  const [feedback, setFeedback] = useState<PortfolioFeedback | null>(null);

  const run = (action: () => void, success: string): boolean => {
    try {
      action();
      setFeedback({ kind: "success", message: success });
      return true;
    } catch (error) {
      setFeedback({ kind: "error", message: describeError(error) });
      return false;
    }
  };

  return { feedback, run };
}
