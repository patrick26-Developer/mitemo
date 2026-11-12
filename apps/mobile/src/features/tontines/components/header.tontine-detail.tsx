import { Share, UserPlus } from "lucide-react-native";

import type { HeaderAction } from "../../../shared/components/macros/header.detail";
import { DetailHeader } from "../../../shared/components/macros/header.detail";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { isTontineAdmin } from "../../../shared/member/model.portfolio";
import { canInviteMembers } from "../../../shared/member/model.tontine-turns";

/** Props de l'en-tête du détail d'une tontine. */
export interface TontineDetailHeaderProps {
  readonly item: Tontine;
  /** Partage l'invitation : code et lien. */
  readonly onShare: () => void;
  /** Ouvre l'ajout d'un membre depuis le répertoire. */
  readonly onAddMember: () => void;
}

/**
 * Actions rapides de l'administrateur : partager l'invitation, et ajouter un
 * membre tant que la tontine en préparation n'a pas tous ses participants.
 * @param props Tontine, partage et ajout.
 * @returns Les actions à poser dans l'en-tête, vides pour un simple membre.
 */
function headerActions(props: TontineDetailHeaderProps): readonly HeaderAction[] {
  const { item, onShare, onAddMember } = props;
  if (!isTontineAdmin(item) || !canInviteMembers(item)) return [];

  return [
    { label: "Partager l'invitation", icon: Share, onPress: onShare },
    { label: "Ajouter un membre", icon: UserPlus, onPress: onAddMember },
  ];
}

/**
 * En-tête du détail d'une tontine : retour et titre teintés de sa couleur,
 * actions rapides à droite.
 * @param props Tontine, partage et ajout.
 * @returns L'en-tête du détail.
 */
export function TontineDetailHeader(props: TontineDetailHeaderProps) {
  return (
    <DetailHeader
      title={props.item.name}
      accent={props.item.headerColors[0]}
      actions={headerActions(props)}
    />
  );
}
