import { View } from "react-native";

import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";
import { canRemove, currentTurnAccent } from "../model/model.member-management";
import type { MemberTurn } from "../model/model.member-turns";
import { TontineMemberRow } from "./row.tontine-member";
import { TurnStep } from "./step.turn";

/** Props d'un rang dans la frise de passage. */
export interface MemberTimelineItemProps {
  readonly item: Tontine;
  readonly entry: MemberTurn;
  /** Ouvre l'historique du membre. */
  readonly onSelect: (member: TontineMember) => void;
  /** Demande la confirmation du retrait du membre. */
  readonly onAskRemove: (member: TontineMember) => void;
}

/**
 * Pose un rang dans la frise verticale : le numéro à gauche, grisé et relié
 * au suivant, et la ligne du membre à droite. Seul le rang du tour en cours
 * prend la couleur de la tontine.
 * @param props Tontine, rang et membre, ouverture de l'historique et retrait.
 * @returns L'élément de la frise.
 */
export function MemberTimelineItem(props: MemberTimelineItemProps) {
  const { item, entry, onSelect, onAskRemove } = props;
  const { member } = entry;
  const accent = currentTurnAccent(item, entry.turn);

  return (
    <View className="flex-row gap-3">
      <TurnStep
        turn={entry.turn}
        last={entry.turn === item.totalRounds}
        {...(accent === undefined ? {} : { accent })}
      />
      <View className="flex-1 pb-2">
        <TontineMemberRow
          member={member}
          {...(accent === undefined ? {} : { focusAccent: accent })}
          {...(canRemove(item, member) ? { onRemove: () => onAskRemove(member) } : {})}
          onPress={() => onSelect(member)}
        />
      </View>
    </View>
  );
}
