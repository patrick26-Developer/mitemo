import type { PortfolioState } from "../../../shared/member/model.portfolio-actions";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";

/** Actions offertes sur une carte de pointage ; leur résultat sort en toast. */
export interface SavingsActionsState {
  readonly contribute: () => void;
  readonly withdraw: () => void;
  readonly transfer: () => void;
}

/**
 * Branche les opérations d'une carte sur le portefeuille local.
 * @param card Carte affichée.
 * @returns Les actions de la carte.
 */
export function useSavingsActions(card: SavingsCard): SavingsActionsState {
  const { run } = usePortfolioFeedback();
  const act = (action: (store: PortfolioState) => void, success: string) =>
    run(() => action(usePortfolioStore.getState()), success);

  return {
    contribute: () => act((store) => store.contributeCard(card.id), "Un marqueur a été ajouté."),
    withdraw: () =>
      act((store) => store.withdrawCard(card.id), "L'épargne a rejoint votre solde disponible."),
    transfer: () =>
      act((store) => store.transferCardToTontine(card.id), "Cotisation de la tontine réglée."),
  };
}
