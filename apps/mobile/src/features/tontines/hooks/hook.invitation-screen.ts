import { router } from "expo-router";

import type { ReceivedInvitation } from "../../../shared/member/model.invitation";
import type { InvitationReplyState } from "./hook.invitation-reply";
import { useInvitationReply } from "./hook.invitation-reply";

/** Réponse à une invitation depuis l'écran de sa tontine. */
export interface InvitationScreenState {
  readonly reply: InvitationReplyState;
  /** Ouvre le choix du nombre de tours. */
  readonly accept: () => void;
  /** Rejoint la tontine avec les tours choisis, puis ouvre son détail. */
  readonly join: () => void;
  /** Refuse l'invitation, puis revient à l'écran précédent. */
  readonly decline: () => void;
}

/**
 * Branche l'écran d'une invitation : accepter ouvre le choix des tours, puis
 * le détail de la tontine rejointe ; refuser ferme l'écran.
 * @param invitation Invitation affichée.
 * @returns La réponse et ses trois gestes.
 */
export function useInvitationScreen(invitation: ReceivedInvitation): InvitationScreenState {
  const reply = useInvitationReply();

  return {
    reply,
    accept: () => reply.choose(invitation),
    join: () => {
      if (reply.accept()) router.replace(`/tontine/${invitation.tontine.id}`);
    },
    decline: () => {
      reply.decline(invitation);
      router.back();
    },
  };
}
