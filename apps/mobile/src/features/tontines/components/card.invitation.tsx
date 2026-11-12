import { Text, View } from "react-native";

import { SheetActionRow } from "../../../shared/components/macros/row.sheet-actions";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { ReceivedInvitation } from "../../../shared/member/model.invitation";
import { invitationFacts } from "../model/model.invitation-reply";

/** Props d'une invitation reçue. */
export interface InvitationCardProps {
  readonly invitation: ReceivedInvitation;
  readonly onAccept: () => void;
  readonly onDecline: () => void;
}

/**
 * Présente une invitation reçue : qui invite, la tontine proposée et son
 * résumé, avec « Refuser » et « Accepter » sur une même ligne.
 * @param props Invitation, acceptation et refus.
 * @returns La carte de l'invitation.
 */
export function InvitationCard(props: InvitationCardProps) {
  const { invitation, onAccept, onDecline } = props;

  return (
    <View className="gap-3 rounded-[16px] border border-card-border p-4">
      <View className="gap-0.5">
        <Text className="text-[16px] font-semibold text-ink">{invitation.tontine.name}</Text>
        <Text className="text-[13px] text-muted">Invitation de {invitation.invitedBy}</Text>
      </View>
      <SheetRecap rows={invitationFacts(invitation.tontine)} />
      <SheetActionRow
        secondary={{ label: "Refuser", onPress: onDecline }}
        primary={{ label: "Accepter", onPress: onAccept }}
      />
    </View>
  );
}
