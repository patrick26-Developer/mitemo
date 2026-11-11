import type { Tontine } from "../../../shared/member/model.portfolio";
import type { PortfolioState } from "../../../shared/member/model.portfolio-actions";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { paymentMethodLabel } from "../../../shared/model/model.payment-method";

/** Exécution d'une opération du portefeuille, avec son message de succès. */
type RunAction = (action: (store: PortfolioState) => void, success: string) => boolean;

/** Actions offertes sur une tontine ; leur résultat sort en toast. */
export interface TontineActionsState {
  /** Inscrit un membre de plus, tant que le quota n'est pas atteint. */
  readonly addMember: () => void;
  /** Lance la tontine, une fois tous ses membres réunis. */
  readonly start: () => void;
  /** Règle la cotisation du tour par l'opérateur choisi. */
  readonly contribute: (method: PaymentMethod) => void;
  /** Confirme la restourne et fait distribuer la cagnotte. */
  readonly confirm: () => void;
  readonly invite: () => void;
  readonly remove: (memberId: string) => void;
}

/** Actions d'une tontine. */
type TontineHandlers = TontineActionsState;

/**
 * Construit le règlement de la cotisation, annoncé avec l'opérateur choisi.
 * @param tontine Tontine affichée.
 * @param act Exécution d'une opération, avec son message de succès.
 * @returns Le règlement par opérateur.
 */
function contributeHandler(tontine: Tontine, act: RunAction): (method: PaymentMethod) => void {
  return (method) => {
    act(
      (store) => store.contributeTontine(tontine.id),
      `Cotisation réglée par ${paymentMethodLabel(method)}.`,
    );
  };
}

/**
 * Construit les actions d'une tontine autour de l'exécution du portefeuille.
 * La distribution est automatique : l'administrateur ne fait que confirmer.
 * @param tontine Tontine affichée.
 * @param act Exécution d'une opération, avec son message de succès.
 * @returns Les actions prêtes à être exposées.
 */
function tontineHandlers(tontine: Tontine, act: RunAction): TontineHandlers {
  return {
    addMember: () =>
      act((store) => store.addMember(tontine.id), "Un membre de plus dans la tontine."),
    start: () => act((store) => store.startTontine(tontine.id), "La tontine est lancée."),
    contribute: contributeHandler(tontine, act),
    confirm: () =>
      act(
        (store) => store.confirmRound(tontine.id),
        "Restourne confirmée : la cagnotte est distribuée.",
      ),
    invite: () =>
      act((store) => {
        store.inviteMember(tontine.id);
      }, "Code d'invitation prêt à partager."),
    remove: (memberId) =>
      act((store) => store.removeMember(tontine.id, memberId), "Membre retiré de la tontine."),
  };
}

/**
 * Branche les opérations d'une tontine sur le portefeuille local.
 * @param tontine Tontine affichée.
 * @returns Les actions de la tontine.
 */
export function useTontineActions(tontine: Tontine): TontineActionsState {
  const { run } = usePortfolioFeedback();
  const act: RunAction = (action, success) =>
    run(() => action(usePortfolioStore.getState()), success);

  return tontineHandlers(tontine, act);
}
