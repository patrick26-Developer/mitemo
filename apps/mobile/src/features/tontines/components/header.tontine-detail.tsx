import { Ellipsis, Share, UserPlus } from "lucide-react-native";
import { useState } from "react";

import type { HeaderAction } from "../../../shared/components/macros/header.detail";
import { DetailHeader } from "../../../shared/components/macros/header.detail";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { isTontineAdmin } from "../../../shared/member/model.portfolio";
import { canInviteMembers } from "../../../shared/member/model.tontine-turns";
import { TontineSettingsSheet } from "./sheet.tontine-settings";

/** Props de l'en-tête du détail d'une tontine. */
export interface TontineDetailHeaderProps {
  readonly item: Tontine;
  /** Partage l'invitation : code et lien. */
  readonly onShare: () => void;
  /** Ouvre l'ajout d'un membre depuis le répertoire. */
  readonly onAddMember: () => void;
}

/**
 * Actions rapides de l'administrateur : partager l'invitation et ajouter un
 * membre tant qu'il en manque, puis « Plus d'options » pour régler la tontine.
 * @param props Tontine, partage et ajout.
 * @param onMore Ouvre les réglages.
 * @returns Les actions à poser dans l'en-tête, vides pour un simple membre.
 */
function headerActions(
  props: TontineDetailHeaderProps,
  onMore: () => void,
): readonly HeaderAction[] {
  const { item, onShare, onAddMember } = props;
  if (!isTontineAdmin(item)) return [];
  const more: HeaderAction = { label: "Plus d'options", icon: Ellipsis, onPress: onMore };
  if (!canInviteMembers(item)) return [more];

  return [
    { label: "Partager l'invitation", icon: Share, onPress: onShare },
    { label: "Ajouter un membre", icon: UserPlus, onPress: onAddMember },
    more,
  ];
}

/**
 * En-tête du détail d'une tontine : retour et titre teintés de sa couleur,
 * actions rapides à droite, et réglages de l'administrateur. Chaque ouverture
 * des réglages repart des valeurs enregistrées.
 * @param props Tontine, partage et ajout.
 * @returns L'en-tête du détail et sa feuille de réglages.
 */
export function TontineDetailHeader(props: TontineDetailHeaderProps) {
  const [settings, setSettings] = useState({ open: false, round: 0 });
  const close = () => setSettings((current) => ({ ...current, open: false }));
  const openSettings = () => setSettings((current) => ({ open: true, round: current.round + 1 }));

  return (
    <>
      <DetailHeader
        title={props.item.name}
        accent={props.item.headerColors[0]}
        actions={headerActions(props, openSettings)}
      />
      <TontineSettingsSheet
        key={settings.round}
        visible={settings.open}
        item={props.item}
        onClose={close}
      />
    </>
  );
}
