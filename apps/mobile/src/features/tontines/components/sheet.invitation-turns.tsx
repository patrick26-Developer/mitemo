import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import type { InvitationScreenState } from "../hooks/hook.invitation-screen";
import { InvitationTurnsFooter } from "./footer.invitation-turns";
import { InvitationTurnsStep } from "./step.invitation-turns";

/** Props de la feuille du choix des tours. */
export interface InvitationTurnsSheetProps {
  readonly state: InvitationScreenState;
}

/**
 * Feuille « Choisir mes tours », ouverte par « Accepter » : le nombre de
 * tours à prendre, puis « Retour » ou « Rejoindre ».
 * @param props Réponse à l'invitation.
 * @returns La feuille, ouverte tant qu'une invitation est acceptée.
 */
export function InvitationTurnsSheet(props: InvitationTurnsSheetProps) {
  const { reply, join } = props.state;
  const { choosing } = reply;

  return (
    <BottomSheet
      visible={choosing !== null}
      title="Choisir mes tours"
      onClose={reply.back}
      footer={<InvitationTurnsFooter onBack={reply.back} onJoin={join} />}
    >
      {choosing === null ? null : (
        <InvitationTurnsStep invitation={choosing} turns={reply.turns} onChange={reply.setTurns} />
      )}
    </BottomSheet>
  );
}
