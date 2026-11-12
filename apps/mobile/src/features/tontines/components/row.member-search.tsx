import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";
import { canCancelInvitation, currentTurnAccent } from "../model/model.member-management";
import type { MemberRow } from "../model/model.member-filter";
import { turnsLabel } from "../model/model.member-turns";
import { InvitedMemberRow } from "./row.member-invited";
import { TontineMemberRow } from "./row.tontine-member";

/** Props d'une ligne de la liste complète des membres. */
export interface MemberSearchRowProps {
  readonly item: Tontine;
  readonly row: MemberRow;
  readonly onSelect: (member: TontineMember) => void;
  readonly onCancelInvitation: (invitationId: string) => void;
}

/**
 * Rend une ligne de la liste complète : un membre avec ses tours en toutes
 * lettres, cerclé quand c'est son tour, ou une invitation grisée que
 * l'administrateur peut annuler avant le départ.
 * @param props Tontine, ligne, ouverture de l'historique et annulation.
 * @returns La ligne du membre ou de l'invitation.
 */
export function MemberSearchRow(props: MemberSearchRowProps) {
  const { item, row, onSelect, onCancelInvitation } = props;
  if (row.kind === "invited") {
    const { invitation } = row;
    const cancel = canCancelInvitation(item)
      ? { onCancel: () => onCancelInvitation(invitation.id) }
      : {};
    return <InvitedMemberRow invitation={invitation} {...cancel} />;
  }
  const accent =
    row.member.id === item.beneficiaryId ? currentTurnAccent(item, item.round) : undefined;

  return (
    <TontineMemberRow
      member={row.member}
      turnsLabel={turnsLabel(item, row.member.id)}
      {...(accent === undefined ? {} : { focusAccent: accent })}
      onPress={() => onSelect(row.member)}
    />
  );
}
