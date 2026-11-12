import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { EmptyState } from "../../../shared/components/macros/state.empty";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { TAB_ICONS } from "../../../shared/theme/theme.tab-icons";
import { InvitationContent } from "./content.invitation";

/** Props de l'écran d'une invitation. */
export interface InvitationScreenProps {
  /** Identifiant de l'invitation reçue. */
  readonly id: string;
}

/**
 * Écran d'une invitation reçue, ouvert depuis les notifications : la
 * tontine à rejoindre, puis la réponse.
 * @param props Identifiant de l'invitation.
 * @returns L'écran, ou l'état vide d'une invitation déjà traitée.
 */
export function InvitationScreen(props: InvitationScreenProps) {
  const invitation = usePortfolioStore((state) =>
    state.invitations.find((item) => item.id === props.id),
  );

  return (
    <ScreenFrame>
      {invitation === undefined ? (
        <>
          <DetailHeader title="Invitation" />
          <EmptyState
            icon={TAB_ICONS.tontines}
            title="Invitation introuvable"
            message="Vous avez déjà répondu à cette invitation."
          />
        </>
      ) : (
        <InvitationContent invitation={invitation} />
      )}
    </ScreenFrame>
  );
}
