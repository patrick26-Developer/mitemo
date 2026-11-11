import { Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import type { TontineMember } from "../../../shared/member/model.portfolio";
import { PALETTE } from "../../../shared/theme/theme.palette";

/** Props d'une ligne de membre d'une tontine. */
export interface TontineMemberRowProps {
  readonly member: TontineMember;
  /** `true` quand l'administrateur peut retirer ce membre. */
  readonly canRemove: boolean;
  readonly onRemove: () => void;
}

/**
 * Affiche un membre, son rôle et l'état de sa cotisation du tour en cours.
 * @param props Membre, droit de retrait et action de retrait.
 * @returns La ligne de membre.
 */
export function TontineMemberRow(props: TontineMemberRowProps) {
  const { member, canRemove, onRemove } = props;
  const role = member.role === "ADMIN" ? "Administrateur" : "Membre";
  const payment = member.paidCurrentRound ? "À jour" : "En attente";

  return (
    <View className="flex-row items-center gap-3 rounded-[14px] border border-card-border px-4 py-3">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-avatar">
        <Text className="text-[14px] font-bold text-white">{member.name.slice(0, 1)}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] text-ink" numberOfLines={1}>
          {member.name}
        </Text>
        <Text className="text-[12px] text-muted">
          {role} · {payment}
        </Text>
      </View>
      {canRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Retirer ${member.name}`}
          hitSlop={8}
          onPress={onRemove}
        >
          <Trash2 size={18} color={PALETTE.danger} />
        </Pressable>
      ) : null}
    </View>
  );
}
