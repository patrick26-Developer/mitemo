import { useState } from "react";
import { Text, View } from "react-native";

import type { Tontine } from "../../../shared/member/model.portfolio";
import {
  isTontineAdmin,
  paidMemberCount,
  SELF_MEMBER_ID,
} from "../../../shared/member/model.portfolio";
import { TontineMemberSheet } from "./sheet.tontine-member";
import { TontineMemberRow } from "./row.tontine-member";

/** Props de la liste des membres d'une tontine. */
export interface TontineMemberListProps {
  readonly item: Tontine;
  readonly onRemove: (memberId: string) => void;
}

/**
 * Affiche les membres de la tontine, met en avant celui dont c'est le tour et
 * ouvre son historique de cotisation au clic. Un administrateur peut retirer
 * les autres membres ; un simple membre voit la même liste sans gestion.
 * @param props Tontine affichée et action de retrait.
 * @returns La liste des membres et la feuille d'historique.
 */
export function TontineMemberList(props: TontineMemberListProps) {
  const { item, onRemove } = props;
  const admin = isTontineAdmin(item);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = item.members.find((member) => member.id === selectedId) ?? null;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between pb-1">
        <Text accessibilityRole="header" className="text-[16px] font-medium text-ink">
          Membres
        </Text>
        <Text className="text-[13px] text-muted">{membersCount(item)}</Text>
      </View>
      {item.members.map((member) => (
        <TontineMemberRow
          key={member.id}
          member={member}
          canRemove={admin && member.id !== SELF_MEMBER_ID && item.state === "PENDING"}
          onRemove={() => onRemove(member.id)}
          focused={item.state === "ACTIVE" && member.id === item.beneficiaryId}
          onPress={() => setSelectedId(member.id)}
        />
      ))}
      <TontineMemberSheet
        visible={selected !== null}
        item={item}
        member={selected}
        onClose={() => setSelectedId(null)}
      />
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
