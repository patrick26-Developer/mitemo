import { Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";
import { accentRing } from "../../../shared/theme/theme.field";
import type { MemberTurn } from "../model/model.member-turns";

/** Props d'une ligne de membre d'une tontine. */
export interface TontineMemberRowProps {
  /** Membre et son rang de passage. */
  readonly entry: MemberTurn;
  /** Couleur de la tontine, présente quand c'est le tour de ce membre : la ligne est cerclée. */
  readonly focusAccent?: string;
  /** Retrait du membre, présent seulement quand l'administrateur peut le retirer. */
  readonly onRemove?: () => void;
  /** Ouvre l'historique de cotisation du membre. */
  readonly onPress?: () => void;
}

/**
 * Affiche un membre avec son rang de passage, son rôle et l'état de sa
 * cotisation du tour en cours. La ligne du bénéficiaire du tour est cerclée de
 * la couleur de la tontine, comme un champ au focus de shadcn/ui.
 * @param props Membre et rang, couleur de mise en avant, retrait et ouverture de l'historique.
 * @returns La ligne de membre.
 */
export function TontineMemberRow(props: TontineMemberRowProps) {
  const { entry, focusAccent, onRemove, onPress } = props;
  const { member, turn } = entry;
  const focused = focusAccent !== undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Historique de ${member.name}`}
      accessibilityState={{ selected: focused }}
      disabled={onPress === undefined}
      onPress={onPress}
      style={focused ? accentRing(focusAccent) : undefined}
      className="flex-row items-center gap-3 rounded-[14px] border border-card-border bg-white px-4 py-3"
    >
      <View
        accessibilityLabel={`Tour ${turn}`}
        className="h-9 w-9 items-center justify-center rounded-full bg-tab-active"
      >
        <Text className="text-[14px] font-bold text-tab-ink">{turn}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] text-ink" numberOfLines={1}>
          {member.name}
        </Text>
        <Text className="text-[12px] text-muted">{memberDetail(entry, focused)}</Text>
      </View>
      {onRemove === undefined ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Retirer ${member.name}`}
          hitSlop={8}
          onPress={onRemove}
        >
          <Trash2 size={18} color={PALETTE.danger} />
        </Pressable>
      )}
    </Pressable>
  );
}

/**
 * Rédige la ligne d'état d'un membre : rôle, cotisation et tour éventuel.
 * @param entry Membre et rang de passage.
 * @param focused Vrai quand c'est son tour.
 * @returns La ligne, par exemple « Membre · En attente · À son tour ».
 */
function memberDetail(entry: MemberTurn, focused: boolean): string {
  const role = entry.member.role === "ADMIN" ? "Administrateur" : "Membre";
  const payment = entry.member.paidCurrentRound ? "À jour" : "En attente";
  return `${role} · ${payment}${focused ? " · À son tour" : ""}`;
}
