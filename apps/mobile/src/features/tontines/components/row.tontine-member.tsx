import { Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import type { TontineMember } from "../../../shared/member/model.portfolio";
import { PALETTE } from "../../../shared/theme/theme.palette";

/** Grossissement léger du membre dont c'est le tour. */
const FOCUSED_SCALE = 1.02;

/** Props d'une ligne de membre d'une tontine. */
export interface TontineMemberRowProps {
  readonly member: TontineMember;
  /** `true` quand l'administrateur peut retirer ce membre. */
  readonly canRemove: boolean;
  readonly onRemove: () => void;
  /** `true` quand c'est le tour de ce membre : la ligne ressort. */
  readonly focused?: boolean;
  /** Ouvre l'historique de cotisation du membre. */
  readonly onPress?: () => void;
}

/**
 * Affiche un membre, son rôle et l'état de sa cotisation du tour en cours.
 * La ligne du bénéficiaire du tour est légèrement agrandie et cerclée.
 * @param props Membre, droit de retrait, retrait, focus et ouverture de l'historique.
 * @returns La ligne de membre.
 */
export function TontineMemberRow(props: TontineMemberRowProps) {
  const { member, canRemove, onRemove, focused = false, onPress } = props;
  const role = member.role === "ADMIN" ? "Administrateur" : "Membre";
  const payment = member.paidCurrentRound ? "À jour" : "En attente";
  const border = focused ? "border-brand" : "border-card-border";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Historique de ${member.name}`}
      accessibilityState={{ selected: focused }}
      disabled={onPress === undefined}
      onPress={onPress}
      style={{ transform: [{ scale: focused ? FOCUSED_SCALE : 1 }] }}
      className={`flex-row items-center gap-3 rounded-[14px] border ${border} px-4 py-3`}
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-avatar">
        <Text className="text-[14px] font-bold text-white">{member.name.slice(0, 1)}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] text-ink" numberOfLines={1}>
          {member.name}
        </Text>
        <Text className="text-[12px] text-muted">
          {role} · {payment}
          {focused ? " · À son tour" : ""}
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
    </Pressable>
  );
}
