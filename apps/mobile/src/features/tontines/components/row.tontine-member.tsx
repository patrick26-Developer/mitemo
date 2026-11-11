import { Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";
import { accentRing } from "../../../shared/theme/theme.field";
import type { MemberTurn } from "../model/model.member-turns";

/** Couleur de l'état de la cotisation : vert à jour, rouge en attente. */
const PAYMENT_COLORS = { paid: "#1F8A4C", due: PALETTE.danger } as const;

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
        <MemberDetail entry={entry} focused={focused} />
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

/** Props de la ligne d'état d'un membre. */
interface MemberDetailProps {
  readonly entry: MemberTurn;
  /** Vrai quand c'est son tour. */
  readonly focused: boolean;
}

/**
 * Ligne d'état d'un membre : rôle, cotisation en couleur (vert à jour, rouge
 * en attente) et tour éventuel, par exemple « Membre · En attente · À son tour ».
 * @param props Membre et mise en avant.
 * @returns La ligne d'état.
 */
function MemberDetail(props: MemberDetailProps) {
  const { member } = props.entry;
  const role = member.role === "ADMIN" ? "Administrateur" : "Membre";
  const paid = member.paidCurrentRound;

  return (
    <Text className="text-[12px] text-muted">
      {role} ·{" "}
      <Text
        className="font-semibold"
        style={{ color: paid ? PAYMENT_COLORS.paid : PAYMENT_COLORS.due }}
      >
        {paid ? "À jour" : "En attente"}
      </Text>
      {props.focused ? " · À son tour" : ""}
    </Text>
  );
}
