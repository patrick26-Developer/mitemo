import { useState } from "react";
import { Text, View } from "react-native";

import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";
import {
  isTontineAdmin,
  paidMemberCount,
  SELF_MEMBER_ID,
} from "../../../shared/member/model.portfolio";
import { accentColors } from "../../../shared/model/model.accent-color";
import type { MemberTurn } from "../model/model.member-turns";
import { memberTurns } from "../model/model.member-turns";
import { TontineMemberSheet } from "./sheet.tontine-member";
import { TontineMemberRow } from "./row.tontine-member";
import { TurnStep } from "./step.turn";

/** Props de la liste des membres d'une tontine. */
export interface TontineMemberListProps {
  readonly item: Tontine;
  readonly onRemove: (memberId: string) => void;
}

/**
 * Affiche les membres dans l'ordre de passage, de 1 au dernier ; celui dont
 * c'est le tour reste à sa place, cerclé. Ouvre l'historique de cotisation
 * d'un membre au clic. Un
 * administrateur peut retirer les autres membres avant le départ, après
 * confirmation ; un simple membre voit la même liste sans gestion.
 * @param props Tontine affichée et action de retrait.
 * @returns La liste des membres, la feuille d'historique et la confirmation de retrait.
 */
export function TontineMemberList(props: TontineMemberListProps) {
  const { item, onRemove } = props;
  const [selected, setSelected] = useState<TontineMember | null>(null);
  const [removing, setRemoving] = useState<TontineMember | null>(null);

  return (
    <View className="gap-2">
      <MembersHeader item={item} />
      <View>
        {memberTurns(item).map((entry) => (
          <MemberTimelineItem
            key={entry.member.id}
            item={item}
            entry={entry}
            onSelect={setSelected}
            onAskRemove={setRemoving}
          />
        ))}
      </View>
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

/** Props d'un membre dans la frise de passage. */
interface MemberTimelineItemProps {
  readonly item: Tontine;
  readonly entry: MemberTurn;
  /** Ouvre l'historique du membre. */
  readonly onSelect: (member: TontineMember) => void;
  /** Demande la confirmation du retrait du membre. */
  readonly onAskRemove: (member: TontineMember) => void;
}

/**
 * Pose un membre dans la frise verticale : son rang à gauche, relié au
 * suivant, et sa ligne à droite.
 * @param props Tontine, membre et rang, ouverture de l'historique et retrait.
 * @returns L'élément de la frise.
 */
function MemberTimelineItem(props: MemberTimelineItemProps) {
  const { item, entry, onSelect, onAskRemove } = props;
  const { member } = entry;

  return (
    <View className="flex-row gap-3">
      <TurnStep
        turn={entry.turn}
        last={entry.turn === item.members.length}
        {...stepAccentOf(item, member)}
      />
      <View className="flex-1 pb-2">
        <TontineMemberRow
          entry={entry}
          {...focusOf(item, member)}
          {...(canRemove(item, member) ? { onRemove: () => onAskRemove(member) } : {})}
          onPress={() => onSelect(member)}
        />
      </View>
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
 * Compte affiché à droite du titre : inscrits avant le départ, cotisations
 * reçues pendant le cycle.
 * @param item Tontine affichée.
 * @returns Le compte, par exemple « 2 sur 5 ont cotisé ».
 */
function membersCount(item: Tontine): string {
  const total = item.members.length;
  if (item.state === "PENDING") return `${total} sur ${item.totalRounds} inscrits`;
  return `${paidMemberCount(item)} sur ${total} ont cotisé`;
}

/**
 * Couleur de mise en avant d'un membre : celle de la tontine, seulement pour
 * le bénéficiaire du tour en cours.
 * @param item Tontine affichée.
 * @param member Membre de la ligne.
 * @returns La prop de mise en avant, vide pour les autres membres.
 */
function focusOf(item: Tontine, member: TontineMember): { focusAccent?: string } {
  const focused = item.state === "ACTIVE" && member.id === item.beneficiaryId;
  return focused ? { focusAccent: accentColors(item.headerColors[0]).background } : {};
}

/**
 * Couleur du rang du tour en cours dans la frise : celle de la tontine.
 * @param item Tontine affichée.
 * @param member Membre de la ligne.
 * @returns La prop de couleur, vide pour les autres rangs.
 */
function stepAccentOf(item: Tontine, member: TontineMember): { accent?: string } {
  const current = item.state === "ACTIVE" && member.id === item.beneficiaryId;
  return current ? { accent: accentColors(item.headerColors[0]).background } : {};
}

/**
 * Indique si l'administrateur peut retirer ce membre : jamais lui-même, et
 * seulement avant le départ de la tontine.
 * @param item Tontine affichée.
 * @param member Membre de la ligne.
 * @returns `true` quand le retrait est permis.
 */
function canRemove(item: Tontine, member: TontineMember): boolean {
  return isTontineAdmin(item) && member.id !== SELF_MEMBER_ID && item.state === "PENDING";
}

/**
 * Texte de la confirmation de retrait d'un membre.
 * @param item Tontine affichée.
 * @param member Membre à retirer, `null` quand la feuille est fermée.
 * @returns Le titre, le message et l'action de la confirmation.
 */
function removalContent(item: Tontine, member: TontineMember | null) {
  const name = member?.name ?? "ce membre";
  return {
    title: `Retirer ${name} ?`,
    message: `${name} ne fera plus partie de « ${item.name} ». Vous pourrez l'inviter de nouveau.`,
    confirmLabel: "Retirer de la tontine",
    tone: "danger" as const,
  };
}
