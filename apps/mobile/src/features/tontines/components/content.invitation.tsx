import { ScrollView, Text, View } from "react-native";

import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { useDockInset } from "../../../shared/hooks/hook.dock-inset";
import type { ReceivedInvitation } from "../../../shared/member/model.invitation";
import { useInvitationScreen } from "../hooks/hook.invitation-screen";
import { TontineRecapCard } from "./card.tontine-recap";
import { InvitationDock } from "./dock.invitation";
import { TontineMemberList } from "./list.tontine-members";
import { InvitationTurnsSheet } from "./sheet.invitation-turns";

/** Props du contenu d'une invitation. */
export interface InvitationContentProps {
  readonly invitation: ReceivedInvitation;
}

/**
 * Montre la tontine d'une invitation comme son détail : qui invite, la carte
 * récapitulative et les membres. « Refuser » et « Accepter » remplacent
 * « Cotiser » dans le dock.
 * @param props Invitation reçue.
 * @returns Le contenu de l'invitation.
 */
export function InvitationContent(props: InvitationContentProps) {
  const { invitation } = props;
  const { tontine } = invitation;
  const state = useInvitationScreen(invitation);
  const inset = useDockInset();

  return (
    <View className="flex-1">
      <DetailHeader title={tontine.name} accent={tontine.headerColors[0]} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-4 pt-5"
        contentContainerStyle={{ paddingBottom: inset.paddingBottom }}
      >
        <Text className="text-[15px] leading-6 text-ink">
          {invitation.invitedBy} vous invite à rejoindre cette tontine.
        </Text>
        <TontineRecapCard item={tontine} />
        <TontineMemberList item={tontine} onRemove={() => undefined} />
        <Text className="text-[14px] leading-6 text-muted">{tontine.description}</Text>
      </ScrollView>
      <InvitationDock
        tontine={tontine}
        onAccept={state.accept}
        onDecline={state.decline}
        onLayout={inset.onDockLayout}
      />
      <InvitationTurnsSheet state={state} />
    </View>
  );
}
