import { useToastStore } from "../feedback/store.toast";

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
 * Exécute une opération du portefeuille et annonce son résultat dans un toast.
 * Une opération refusée par le modèle ne modifie pas l'état et affiche sa
 * raison, par exemple un solde insuffisant.
 * @returns La fonction d'exécution, qui indique si l'opération a réussi.
 */
export function usePortfolioFeedback() {
  const show = useToastStore((state) => state.show);

  const run = (action: () => void, success: string): boolean => {
    try {
      action();
      show("success", success);
      return true;
    } catch (error) {
      show("error", describeError(error));
      return false;
    }
  };

  return { run };
}
