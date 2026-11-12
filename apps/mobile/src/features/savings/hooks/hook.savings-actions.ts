import type { PortfolioState } from "../../../shared/member/model.portfolio-actions";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { nowIsoUtc } from "../../../shared/model/model.clock";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { paymentMethodLabel, paymentMethodName } from "../../../shared/model/model.payment-method";
import { formatAmount } from "../../../shared/format/format.amount";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import { todayUtc } from "../../../shared/model/model.clock";

/** Actions offertes sur une carte de pointage ; leur résultat sort en toast. */
export interface SavingsActionsState {
  /** Pointe un marqueur, réglé par l'opérateur choisi. */
  readonly contribute: (method: PaymentMethod) => void;
  /** Retire l'épargne vers le moyen choisi : le solde Mitemo ou un opérateur. */
  readonly withdraw: (method: PaymentMethod) => void;
  readonly transfer: () => void;
}

/**
 * Message d'un retrait réussi, selon sa destination.
 * @param card Carte retirée.
 * @param method Destination de l'épargne.
 * @returns Le message du toast.
 */
function withdrawMessage(card: SavingsCard, method: PaymentMethod): string {
  if (method === "MITEMO") return "L'épargne a rejoint votre solde disponible.";

  return `Retrait de ${formatAmount(card.saved)} FCFA vers ${paymentMethodName(method)} lancé.`;
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
    withdraw: (method) =>
      act((store) => store.withdrawCard(card.id, method), withdrawMessage(card, method)),
    transfer: () =>
      act(
        (store) => store.transferCardToTontine(card.id, todayUtc()),
        "Cotisation réglée : la carte repart sur une copie neuve.",
      ),
  };
}
