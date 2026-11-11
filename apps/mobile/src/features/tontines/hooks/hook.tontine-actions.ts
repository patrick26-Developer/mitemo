import type { Tontine } from "../../../shared/member/model.portfolio";
import type { PortfolioState } from "../../../shared/member/model.portfolio-actions";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { PortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";

/** Exécution d'une opération du portefeuille, avec son message de succès. */
type RunAction = (action: (store: PortfolioState) => void, success: string) => boolean;

/** Actions offertes sur une tontine, avec leur retour à l'écran. */
export interface TontineActionsState {
  readonly feedback: PortfolioFeedback | null;
  readonly contribute: () => void;
  readonly withdraw: () => void;
  readonly invite: () => void;
  readonly remove: (memberId: string) => void;
  /** Transfère un montant à un membre ; renvoie `true` quand il est parti. */
  readonly transfer: (memberId: string, amount: bigint) => boolean;
}

/** Actions d'une tontine, sans le retour d'opération. */
type TontineHandlers = Omit<TontineActionsState, "feedback">;

/**
 * Construit les actions d'une tontine autour de l'exécution du portefeuille.
 * @param tontine Tontine affichée.
 * @param act Exécution d'une opération, avec son message de succès.
 * @returns Les actions prêtes à être exposées.
 */
function tontineHandlers(tontine: Tontine, act: RunAction): TontineHandlers {
  return {
    contribute: () =>
      act((store) => store.contributeTontine(tontine.id), "Cotisation réglée pour ce tour."),
    withdraw: () =>
      act((store) => store.withdrawTontine(tontine.id), "Cagnotte versée sur votre solde."),
    invite: () =>
      act((store) => {
        store.inviteMember(tontine.id);
      }, "Code d'invitation prêt à partager."),
    remove: (memberId) =>
      act((store) => store.removeMember(tontine.id, memberId), "Membre retiré de la tontine."),
    transfer: (memberId, amount) =>
      act(
        (store) => store.transferToMember(tontine.id, memberId, amount),
        "Transfert envoyé au membre.",
      ),
  };
}

/**
 * Branche les opérations d'une tontine sur le portefeuille local.
 * @param tontine Tontine affichée.
 * @returns Les actions et le dernier retour d'opération.
 */
export function useTontineActions(tontine: Tontine): TontineActionsState {
  const { feedback, run } = usePortfolioFeedback();
  const act: RunAction = (action, success) =>
    run(() => action(usePortfolioStore.getState()), success);

  return { feedback, ...tontineHandlers(tontine, act) };
}
