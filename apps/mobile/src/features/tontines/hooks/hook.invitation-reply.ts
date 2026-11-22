import { useState } from "react";

import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import type { ReceivedInvitation } from "../../../shared/member/model.invitation";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";

/** État de la réponse aux invitations reçues. */
export interface InvitationReplyState {
  readonly invitations: readonly ReceivedInvitation[];
  /** Invitation acceptée dont on choisit les tours, `null` sur la liste. */
  readonly choosing: ReceivedInvitation | null;
  readonly turns: number;
  readonly setTurns: (turns: number) => void;
  /** Passe au choix du nombre de tours, en partant d'un tour. */
  readonly choose: (invitation: ReceivedInvitation) => void;
  readonly back: () => void;
  /** Rejoint la tontine avec les tours choisis ; renvoie `true` en cas de succès. */
  readonly accept: () => boolean;
  readonly decline: (invitation: ReceivedInvitation) => void;
}

/** Choix en cours : l'invitation acceptée et ses tours. */
type TurnsChoice = Pick<
  InvitationReplyState,
  "choosing" | "turns" | "setTurns" | "choose" | "back"
>;

/**
 * Garde l'invitation acceptée et le nombre de tours choisi, qui repart d'un
 * tour à chaque nouvelle acceptation.
 * @returns L'invitation choisie, ses tours et le retour à la liste.
 */
function useTurnsChoice(): TurnsChoice {
  const [choosing, setChoosing] = useState<ReceivedInvitation | null>(null);
  const [turns, setTurns] = useState(1);

  return {
    choosing,
    turns,
    setTurns,
    choose: (invitation) => {
      setTurns(1);
      setChoosing(invitation);
    },
    back: () => setChoosing(null),
  };
}

/**
 * Branche la réponse aux invitations reçues sur le portefeuille : accepter
 * en choisissant ses tours, ou refuser. Le résultat sort en toast.
 * @returns Les invitations, le choix en cours et les réponses.
 */
export function useInvitationReply(): InvitationReplyState {
  const invitations = usePortfolioStore((state) => state.invitations);
  const { run } = usePortfolioFeedback();
  const choice = useTurnsChoice();
  const store = () => usePortfolioStore.getState();
  const { choosing, turns, back } = choice;

  return {
    ...choice,
    invitations,
    accept: () => acceptChoice({ choosing, turns, run, store, done: back }),
    decline: (invitation) => {
      run(() => store().declineInvitation(invitation.id), null);
    },
  };
}

/** Ce qu'il faut pour valider le choix des tours. */
interface AcceptChoice {
  readonly choosing: ReceivedInvitation | null;
  readonly turns: number;
  readonly run: (action: () => void, success: string | null) => boolean;
  readonly store: () => ReturnType<typeof usePortfolioStore.getState>;
  readonly done: () => void;
}

/**
 * Rejoint la tontine choisie avec ses tours, puis revient à la liste.
 * @param input Invitation, tours, exécution, store et retour.
 * @returns `true` quand la tontine est rejointe.
 */
function acceptChoice(input: AcceptChoice): boolean {
  const { choosing, turns, run, store, done } = input;
  if (choosing === null) return false;
  const joined = run(
    () => store().acceptInvitation(choosing.id, turns),
    `Vous avez rejoint « ${choosing.tontine.name} ».`,
  );
  if (joined) done();
  return joined;
}
