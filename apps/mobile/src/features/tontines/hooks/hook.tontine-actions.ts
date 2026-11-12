import type { Tontine } from "../../../shared/member/model.portfolio";
import type { PortfolioState } from "../../../shared/member/model.portfolio-actions";
import type { MemberContact } from "../../../shared/member/model.portfolio-create";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { paymentMethodLabel } from "../../../shared/model/model.payment-method";
import { shareInvitation } from "../api/api.share-invitation";

/** Exécution d'une opération du portefeuille, avec son message de succès. */
type RunAction = (action: (store: PortfolioState) => void, success: string | null) => boolean;

/** Actions offertes sur une tontine ; leur résultat sort en toast. */
export interface TontineActionsState {
  /** Invite un contact qui a un compte Mitemo ; il rejoint la tontine en acceptant. */
  readonly invite: (contact: MemberContact) => void;
  /** Annule une invitation envoyée, tant que le contact n'a pas répondu. */
  readonly cancelInvitation: (invitationId: string) => void;
  /** Lance la tontine, une fois tous ses membres réunis. */
  readonly start: () => void;
  /** Règle la cotisation du tour par l'opérateur choisi. */
  readonly contribute: (method: PaymentMethod) => void;
  /** Confirme le tour : la restourne est versée au membre dont c'est le tour. */
  readonly confirm: () => void;
  /** Partage l'invitation (code et lien), en créant le code au premier partage. */
  readonly share: () => void;
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
 * Construit l'envoi et l'annulation des invitations : le contact devient
 * membre seulement en acceptant.
 * @param tontine Tontine affichée.
 * @param act Exécution d'une opération, avec son message de succès.
 * @returns L'invitation et son annulation.
 */
function invitationHandlers(
  tontine: Tontine,
  act: RunAction,
): Pick<TontineHandlers, "invite" | "cancelInvitation"> {
  return {
    invite: (contact) => act((store) => store.inviteContact(tontine.id, contact), null),
    cancelInvitation: (invitationId) =>
      act((store) => store.cancelInvitation(tontine.id, invitationId), null),
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
    ...invitationHandlers(tontine, act),
    start: () => act((store) => store.startTontine(tontine.id), "La tontine est lancée."),
    contribute: contributeHandler(tontine, act),
    confirm: () =>
      act(
        (store) => store.confirmRound(tontine.id),
        "Restourne confirmée : elle est versée au membre dont c'est le tour.",
      ),
    share: () => {
      act((store) => shareInvitation(tontine, store.inviteMember(tontine.id)), null);
    },
    remove: (memberId) => act((store) => store.removeMember(tontine.id, memberId), null),
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
