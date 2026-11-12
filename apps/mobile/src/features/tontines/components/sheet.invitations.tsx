import { View } from "react-native";

import { SheetActionRow } from "../../../shared/components/macros/row.sheet-actions";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import type { InvitationReplyState } from "../hooks/hook.invitation-reply";
import { InvitationCard } from "./card.invitation";
import { InvitationTurnsStep } from "./step.invitation-turns";

/** Props de la feuille des invitations reçues. */
export interface InvitationsSheetProps {
  readonly visible: boolean;
  readonly reply: InvitationReplyState;
  readonly onClose: () => void;
}

/**
 * Feuille des invitations reçues : comme pour un groupe WhatsApp, le membre
 * accepte ou refuse. Accepter passe au choix du nombre de tours, puis
 * « Rejoindre » l'inscrit dans la tontine.
 * @param props Visibilité, état de la réponse et fermeture.
 * @returns La feuille des invitations.
 */
export function InvitationsSheet(props: InvitationsSheetProps) {
  const { visible, reply, onClose } = props;
  const { choosing } = reply;
  const close = () => {
    reply.back();
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      title={choosing === null ? "Invitations" : "Choisir mes tours"}
      onClose={close}
      {...(choosing === null ? {} : { footer: <TurnsFooter reply={reply} onJoined={close} /> })}
    >
      {choosing === null ? (
        <InvitationList reply={reply} />
      ) : (
        <InvitationTurnsStep invitation={choosing} turns={reply.turns} onChange={reply.setTurns} />
      )}
    </BottomSheet>
  );
}

/** Props de la liste des invitations. */
interface InvitationListProps {
  readonly reply: InvitationReplyState;
}

/**
 * Empile les invitations reçues, chacune avec ses deux réponses.
 * @param props État de la réponse.
 * @returns La liste des invitations.
 */
function InvitationList(props: InvitationListProps) {
  const { reply } = props;

  return (
    <View className="gap-3">
      {reply.invitations.map((invitation) => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          onAccept={() => reply.choose(invitation)}
          onDecline={() => reply.decline(invitation)}
        />
      ))}
    </View>
  );
}

/** Props du pied du choix des tours. */
interface TurnsFooterProps {
  readonly reply: InvitationReplyState;
  readonly onJoined: () => void;
}

/**
 * « Retour » et « Rejoindre » côte à côte ; la feuille se ferme une fois la
 * tontine rejointe.
 * @param props État de la réponse et fermeture.
 * @returns Le pied de la feuille.
 */
function TurnsFooter(props: TurnsFooterProps) {
  const { reply, onJoined } = props;

  return (
    <SheetActionRow
      secondary={{ label: "Retour", onPress: reply.back }}
      primary={{
        label: "Rejoindre",
        onPress: () => {
          if (reply.accept()) onJoined();
        },
      }}
    />
  );
}
