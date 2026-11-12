import type { LayoutChangeEvent } from "react-native";

import { ActionsDock } from "../../../shared/components/macros/dock.actions";
import type { Tontine } from "../../../shared/member/model.portfolio";

/** Props du dock d'une invitation. */
export interface InvitationDockProps {
  readonly tontine: Tontine;
  readonly onAccept: () => void;
  readonly onDecline: () => void;
  /** Mesure du dock, pour que le contenu réserve sa hauteur réelle. */
  readonly onLayout: (event: LayoutChangeEvent) => void;
}

/**
 * Remplace « Cotiser » par la réponse à l'invitation, sur une même ligne :
 * « Refuser » à gauche, « Accepter » à droite, teinté de la tontine.
 * @param props Tontine, acceptation, refus et mesure du dock.
 * @returns Le dock de l'invitation.
 */
export function InvitationDock(props: InvitationDockProps) {
  const { tontine, onAccept, onDecline, onLayout } = props;

  return (
    <ActionsDock
      secondary={{ label: "Refuser", onPress: onDecline }}
      primary={{ label: "Accepter", onPress: onAccept, accent: tontine.headerColors[0] }}
      onLayout={onLayout}
    />
  );
}
