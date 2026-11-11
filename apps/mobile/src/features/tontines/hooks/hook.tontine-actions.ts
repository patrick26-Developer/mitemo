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
  /** Inscrit un membre de plus, tant que le quota n'est pas atteint. */
  readonly addMember: () => void;
  /** Lance la tontine, une fois tous ses membres réunis. */
  readonly start: () => void;
  readonly contribute: () => void;
  /** Confirme la restourne et fait distribuer la cagnotte. */
  readonly confirm: () => void;
  readonly invite: () => void;
  readonly remove: (memberId: string) => void;
}

/** Actions d'une tontine, sans le retour d'opération. */
type TontineHandlers = Omit<TontineActionsState, "feedback">;

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
    contribute: () =>
      act((store) => store.contributeTontine(tontine.id), "Cotisation réglée pour ce tour."),
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
 * @returns Les actions et le dernier retour d'opération.
 */
export function useTontineActions(tontine: Tontine): TontineActionsState {
  const { feedback, run } = usePortfolioFeedback();
  const act: RunAction = (action, success) =>
    run(() => action(usePortfolioStore.getState()), success);

  return { feedback, ...tontineHandlers(tontine, act) };
}
