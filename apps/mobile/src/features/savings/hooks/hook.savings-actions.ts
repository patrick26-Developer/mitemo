import type { PortfolioState } from "../../../shared/member/model.portfolio-actions";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { PortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";

/** Actions offertes sur une carte de pointage, avec leur retour à l'écran. */
export interface SavingsActionsState {
  readonly feedback: PortfolioFeedback | null;
  readonly contribute: () => void;
  readonly withdraw: () => void;
  readonly transfer: () => void;
}

/**
 * Branche les opérations d'une carte sur le portefeuille local.
 * @param card Carte affichée.
 * @returns Les actions et le dernier retour d'opération.
 */
export function useSavingsActions(card: SavingsCard): SavingsActionsState {
  const { feedback, run } = usePortfolioFeedback();
  const act = (action: (store: PortfolioState) => void, success: string) =>
    run(() => action(usePortfolioStore.getState()), success);

  return {
    feedback,
    contribute: () => act((store) => store.contributeCard(card.id), "Un marqueur a été ajouté."),
    withdraw: () =>
      act((store) => store.withdrawCard(card.id), "L'épargne a rejoint votre solde disponible."),
    transfer: () =>
      act((store) => store.transferCardToTontine(card.id), "Cotisation de la tontine réglée."),
  };
}
