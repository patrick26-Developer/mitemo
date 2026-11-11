import { Text, View } from "react-native";

import type { Tontine } from "../../../shared/member/model.portfolio";
import { isTontineAdmin, SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { TontineMemberRow } from "./row.tontine-member";

/** Props de la liste des membres d'une tontine. */
export interface TontineMemberListProps {
  readonly item: Tontine;
  readonly onRemove: (memberId: string) => void;
}

/**
 * Affiche les membres de la tontine. Un administrateur peut retirer les autres
 * membres ; un simple membre voit la même liste sans action de gestion.
 * @param props Tontine affichée et action de retrait.
 * @returns La liste des membres.
 */
export function TontineMemberList(props: TontineMemberListProps) {
  const { item, onRemove } = props;
  const admin = isTontineAdmin(item);

  return (
    <View className="gap-2">
      <Text className="text-[16px] font-medium text-ink">Membres ({item.members.length})</Text>
      {item.members.map((member) => (
        <TontineMemberRow
          key={member.id}
          member={member}
          canRemove={admin && member.id !== SELF_MEMBER_ID}
          onRemove={() => onRemove(member.id)}
        />
      ))}
    </View>
  );
}
