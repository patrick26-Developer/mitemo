import { Bell } from "lucide-react-native";
import { Text, View } from "react-native";

import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { SheetInfoCard } from "../../../shared/components/macros/card.sheet-info";
import { SheetSection } from "../../../shared/components/macros/section.sheet";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { PALETTE } from "../../../shared/theme/theme.palette";
import type { InvitationReplyState } from "../../tontines";
import { InvitationCard } from "../../tontines";
import type { HomeNotification } from "../model/model.home-notifications";
import { buildNotifications } from "../model/model.home-notifications";

/** Props du contenu des notifications. */
export interface NotificationsContentProps {
  readonly reply: InvitationReplyState;
}

/**
 * Liste les invitations reçues en premier, chacune avec Refuser et Accepter,
 * puis les notifications déduites des tontines et des cartes du membre.
 * @param props État de la réponse aux invitations.
 * @returns Les sections de la feuille, ou le message « à jour ».
 */
export function NotificationsContent(props: NotificationsContentProps) {
  const { reply } = props;
  const tontines = usePortfolioStore((state) => state.tontines);
  const cards = usePortfolioStore((state) => state.cards);
  const notifications = buildNotifications(tontines, cards);
  if (reply.invitations.length === 0 && notifications.length === 0) {
    return (
      <SheetText>Vous êtes à jour : aucune action n&apos;est attendue pour le moment.</SheetText>
    );
  }

  return (
    <>
      {reply.invitations.length === 0 ? null : <InvitationsSection reply={reply} />}
      {notifications.length === 0 ? null : <RecentSection notifications={notifications} />}
    </>
  );
}

/** Props de la section des invitations. */
interface InvitationsSectionProps {
  readonly reply: InvitationReplyState;
}

/**
 * Invitations reçues, à accepter en choisissant ses tours ou à refuser.
 * @param props État de la réponse aux invitations.
 * @returns La section « Invitations ».
 */
function InvitationsSection(props: InvitationsSectionProps) {
  const { reply } = props;

  return (
    <SheetSection title="Invitations">
      {reply.invitations.map((invitation) => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          onAccept={() => reply.choose(invitation)}
          onDecline={() => reply.decline(invitation)}
        />
      ))}
    </SheetSection>
  );
}

/** Props de la section des notifications récentes. */
interface RecentSectionProps {
  readonly notifications: readonly HomeNotification[];
}

/**
 * Notifications récentes : cotisations à régler, restournes et cartes en cours.
 * @param props Notifications à afficher.
 * @returns La section « Récentes ».
 */
function RecentSection(props: RecentSectionProps) {
  return (
    <SheetSection title="Récentes">
      {props.notifications.map((notification) => (
        <SheetInfoCard key={notification.id}>
          <View className="flex-row items-center gap-2">
            <Bell size={16} color={PALETTE.brand} />
            <Text className="flex-1 text-[15px] font-semibold text-ink">{notification.title}</Text>
            <Text className="text-[11px] text-muted">{notification.time}</Text>
          </View>
          <Text className="text-[13px] leading-5 text-muted">{notification.message}</Text>
        </SheetInfoCard>
      ))}
    </SheetSection>
  );
}
