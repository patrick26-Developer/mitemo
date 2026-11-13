import { router } from "expo-router";

import { useMoneyFlightStore } from "../../../shared/feedback/store.money-flight";

import type { PortfolioState } from "../../../shared/member/model.portfolio-actions";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { nowIsoUtc } from "../../../shared/model/model.clock";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { paymentMethodLabel, paymentMethodName } from "../../../shared/model/model.payment-method";
import { formatAmount } from "../../../shared/format/format.amount";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import { todayUtc } from "../../../shared/model/model.clock";
import { markerCharge } from "../model/model.card-pay";

/** Actions offertes sur une carte de pointage ; leur résultat sort en toast. */
export interface SavingsActionsState {
  /** Pointe un marqueur, réglé par l'opérateur choisi. */
  readonly contribute: (method: PaymentMethod) => void;
  /** Retire l'épargne vers le moyen choisi : le solde Mitemo ou un opérateur. */
  readonly withdraw: (method: PaymentMethod) => void;
  readonly transfer: () => void;
  /** Supprime une carte sans pointage, puis revient à la liste des cartes. */
  readonly discard: () => void;
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

/** Lance une opération sur le store et annonce sa réussite. */
type CardAct = (
  action: (store: PortfolioState) => void,
  success: string,
  festive?: boolean,
) => boolean;

/**
 * Revient à la liste avant de supprimer la carte, pour ne jamais afficher la
 * page d'une carte disparue.
 * @param card Carte à supprimer.
 * @param act Lancement de l'opération.
 */
function discardCard(card: SavingsCard, act: CardAct): void {
  router.back();
  act((store) => store.deleteCard(card.id), "Carte supprimée.", false);
}

/**
 * Règle le prochain pointage, puis fait voler le montant prélevé jusqu'à la
 * somme de la carte, où la fête se lance à l'arrivée.
 * @param card Carte à pointer.
 * @param act Exécution d'une opération, avec son message de succès.
 * @param method Moyen de paiement choisi.
 */
function payMarker(card: SavingsCard, act: CardAct, method: PaymentMethod): void {
  const charge = markerCharge(card);
  const paid = act(
    (store) => store.contributeCard(card.id, { at: nowIsoUtc(), method }),
    `Pointage réglé par ${paymentMethodLabel(method)}.`,
    false,
  );
  if (paid) useMoneyFlightStore.getState().launch(charge);
}

/**
 * Branche les opérations d'une carte sur le portefeuille local.
 * @param card Carte affichée.
 * @returns Les actions de la carte.
 */
export function useSavingsActions(card: SavingsCard): SavingsActionsState {
  const { run } = usePortfolioFeedback();
  const act: CardAct = (action, success, festive = true) =>
    run(() => action(usePortfolioStore.getState()), success, festive);

  return {
    contribute: (method) => payMarker(card, act, method),
    withdraw: (method) =>
      act((store) => store.withdrawCard(card.id, method), withdrawMessage(card, method)),
    transfer: () =>
      act(
        (store) => store.transferCardToTontine(card.id, todayUtc()),
        "Cotisation réglée : la carte repart sur une copie neuve.",
      ),
    discard: () => discardCard(card, act),
  };
}
