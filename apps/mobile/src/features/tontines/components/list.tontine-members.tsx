import { useState } from "react";
import { Text, View } from "react-native";

import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";
import { paidMemberCount } from "../../../shared/member/model.portfolio";
import { takenTurns } from "../../../shared/member/model.tontine-turns";
import { previewTurns } from "../model/model.member-turns";
import { canCancelInvitation, removalContent } from "../model/model.member-management";
import { InvitedMemberRow } from "./row.member-invited";
import { MemberTimelineItem } from "./item.member-timeline";
import { SeeAllMembersButton } from "./button.see-all-members";
import { TontineMemberSheet } from "./sheet.tontine-member";

/** Nombre de lignes montrées dans le détail, avant « Voir tous les membres ». */
const PREVIEW_SIZE = 5;

/** Props de la liste des membres d'une tontine. */
export interface TontineMemberListProps {
  readonly item: Tontine;
  readonly onRemove: (memberId: string) => void;
  /** Annule une invitation envoyée ; l'administrateur seul la reçoit. */
  readonly onCancelInvitation?: (invitationId: string) => void;
  /** Membre dont la fiche s'ouvre d'emblée, demandé par une notification. */
  readonly focusMemberId?: string | null;
}

/**
 * Affiche un aperçu des membres dans l'ordre de passage, centré sur le tour en
 * cours, puis les invitations envoyées, grisées. Une tontine de 1 000 membres
 * n'est jamais déroulée ici : « Voir tous les membres » ouvre la liste
 * complète, avec recherche et filtres. Ouvre l'historique de cotisation d'un
 * membre au clic, et laisse l'administrateur retirer un membre avant le
 * départ, après confirmation.
 * @param props Tontine, retrait, annulation et membre à ouvrir d'emblée.
 * @returns L'aperçu, la feuille d'historique et la confirmation de retrait.
 */
export function TontineMemberList(props: TontineMemberListProps) {
  const { item, onRemove, onCancelInvitation, focusMemberId = null } = props;
  const [selected, setSelected] = useState<TontineMember | null>(
    () => item.members.find((member) => member.id === focusMemberId) ?? null,
  );
  const [removing, setRemoving] = useState<TontineMember | null>(null);

  return (
    <View className="gap-2">
      <MembersHeader item={item} />
      <MembersPreview
        item={item}
        onSelect={setSelected}
        onAskRemove={setRemoving}
        {...(onCancelInvitation === undefined ? {} : { onCancelInvitation })}
      />
      <TontineMemberSheet
        visible={selected !== null}
        item={item}
        member={selected}
        onClose={() => setSelected(null)}
      />
      <ConfirmSheet
        content={removalContent(item, removing)}
        visible={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={() => {
          if (removing !== null) onRemove(removing.id);
          setRemoving(null);
        }}
      />
    </View>
  );
}

/** Props de l'aperçu des membres. */
interface MembersPreviewProps {
  readonly item: Tontine;
  readonly onSelect: (member: TontineMember) => void;
  readonly onAskRemove: (member: TontineMember) => void;
  readonly onCancelInvitation?: (invitationId: string) => void;
}

/**
 * Pose la frise des rangs, les invitations qui tiennent encore dans l'aperçu
 * et le lien vers la liste complète quand tout n'y tient pas.
 * @param props Tontine, ouverture de l'historique, retrait et annulation.
 * @returns L'aperçu des membres.
 */
function MembersPreview(props: MembersPreviewProps) {
  const { item, onSelect, onAskRemove, onCancelInvitation } = props;
  const entries = previewTurns(item, PREVIEW_SIZE);
  const invitations = item.invitations.slice(0, Math.max(PREVIEW_SIZE - entries.length, 0));
  const total = item.members.length + item.invitations.length;
  const hidden = takenTurns(item) + item.invitations.length > entries.length + invitations.length;
  const cancellable = onCancelInvitation !== undefined && canCancelInvitation(item);

  return (
    <View className="gap-2">
      <View>
        {entries.map((entry) => (
          <MemberTimelineItem
            key={entry.turn}
            item={item}
            entry={entry}
            onSelect={onSelect}
            onAskRemove={onAskRemove}
          />
        ))}
      </View>
      {invitations.map((invitation) => (
        <InvitedMemberRow
          key={invitation.id}
          invitation={invitation}
          {...(cancellable ? { onCancel: () => onCancelInvitation(invitation.id) } : {})}
        />
      ))}
      {hidden ? <SeeAllMembersButton tontineId={item.id} count={total} /> : null}
    </View>
  );
}

/** Props de l'en-tête de la liste. */
interface MembersHeaderProps {
  readonly item: Tontine;
}

/**
 * Titre de la liste et compte des inscrits ou des cotisations reçues.
 * @param props Tontine affichée.
 * @returns L'en-tête de la liste.
 */
function MembersHeader(props: MembersHeaderProps) {
  return (
    <View className="flex-row items-center justify-between pb-1">
      <Text accessibilityRole="header" className="text-[16px] font-medium text-ink">
        Membres
      </Text>
      <Text className="text-[13px] text-muted">{membersCount(props.item)}</Text>
    </View>
  );
}

/**
 * Compte affiché à droite du titre : inscrits et invités avant le départ (les
 * tours pris sont dans le récapitulatif), cotisations reçues pendant le cycle.
 * @param item Tontine affichée.
 * @returns Le compte, par exemple « 3 inscrits · 2 invités » ou « 2 sur 5 ont cotisé ».
 */
function membersCount(item: Tontine): string {
  if (item.state !== "PENDING")
    return `${paidMemberCount(item)} sur ${item.members.length} ont cotisé`;
  const joined = plural(item.members.length, "inscrit");
  const invited = item.invitations.length;
  return invited === 0 ? joined : `${joined} · ${plural(invited, "invité")}`;
}

/**
 * Accorde un nom avec son nombre.
 * @param count Nombre.
 * @param noun Nom au singulier.
 * @returns Par exemple « 1 invité » ou « 3 inscrits ».
 */
function plural(count: number, noun: string): string {
  return `${count} ${noun}${count > 1 ? "s" : ""}`;
}
