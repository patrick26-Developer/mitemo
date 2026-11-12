import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import type { InvitationReplyState } from "../../tontines";
import { InvitationTurnsFooter, InvitationTurnsStep, useInvitationReply } from "../../tontines";
import { NotificationsContent } from "./content.notifications";

/** Props de la feuille des notifications. */
export interface NotificationsSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Feuille des notifications : invitations reçues, à accepter ou refuser, puis
 * actions attendues sur les tontines et les cartes. Accepter une invitation
 * fait passer la même feuille au choix du nombre de tours, une seule feuille
 * à la fois.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille des notifications.
 */
export function NotificationsSheet(props: NotificationsSheetProps) {
  const { visible, onClose } = props;
  const reply = useInvitationReply();
  const { choosing } = reply;
  const close = () => {
    reply.back();
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      title={choosing === null ? "Notifications" : "Choisir mes tours"}
      onClose={close}
      {...(choosing === null ? {} : { footer: <TurnsFooter reply={reply} /> })}
    >
      {choosing === null ? (
        <NotificationsContent reply={reply} />
      ) : (
        <InvitationTurnsStep invitation={choosing} turns={reply.turns} onChange={reply.setTurns} />
      )}
    </BottomSheet>
  );
}

/** Props du pied du choix des tours. */
interface TurnsFooterProps {
  readonly reply: InvitationReplyState;
}

/**
 * « Retour » et « Rejoindre » ; une fois la tontine rejointe, la feuille
 * revient aux notifications.
 * @param props État de la réponse aux invitations.
 * @returns Le pied de la feuille.
 */
function TurnsFooter(props: TurnsFooterProps) {
  const { reply } = props;

  return <InvitationTurnsFooter onBack={reply.back} onJoin={() => reply.accept()} />;
}
