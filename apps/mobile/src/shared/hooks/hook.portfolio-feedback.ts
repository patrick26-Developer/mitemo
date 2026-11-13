import { useCelebrationStore } from "../feedback/store.celebration";
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
 * raison, par exemple un solde insuffisant. Un succès sans message (`null`)
 * reste silencieux : la feuille de partage native, par exemple, suffit. Une
 * réussite annoncée se fête aussi (confettis, carillon, vibration), sauf
 * quand `celebrate` vaut `false`, par exemple pour une suppression.
 * @returns La fonction d'exécution, qui indique si l'opération a réussi.
 */
export function usePortfolioFeedback() {
  const show = useToastStore((state) => state.show);
  const celebrate = useCelebrationStore((state) => state.celebrate);

  const run = (action: () => void, success: string | null, festive = true): boolean => {
    try {
      action();
      if (success === null) return true;
      show("success", success);
      if (festive) celebrate();
      return true;
    } catch (error) {
      show("error", describeError(error));
      return false;
    }
  };

  return { run };
}
