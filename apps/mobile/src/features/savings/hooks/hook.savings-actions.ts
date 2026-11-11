import type { PortfolioState } from "../../../shared/member/model.portfolio-actions";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { nowIsoUtc } from "../../../shared/model/model.clock";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { paymentMethodLabel } from "../../../shared/model/model.payment-method";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";

/** Actions offertes sur une carte de pointage ; leur résultat sort en toast. */
export interface SavingsActionsState {
  /** Pointe un marqueur, réglé par l'opérateur choisi. */
  readonly contribute: (method: PaymentMethod) => void;
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
    contribute: (method) =>
      act(
        (store) => store.contributeCard(card.id, { at: nowIsoUtc(), method }),
        `Pointage réglé par ${paymentMethodLabel(method)}.`,
      ),
    withdraw: () =>
      act((store) => store.withdrawCard(card.id), "L'épargne a rejoint votre solde disponible."),
    transfer: () =>
      act((store) => store.transferCardToTontine(card.id), "Cotisation de la tontine réglée."),
  };
}
