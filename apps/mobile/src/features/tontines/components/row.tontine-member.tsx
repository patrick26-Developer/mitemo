import { Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";
import { accentRing } from "../../../shared/theme/theme.field";
import type { TontineMember } from "../../../shared/member/model.portfolio";
import { avatarColor } from "../../../shared/model/model.avatar-color";

/** Couleur de l'état de la cotisation : vert à jour, rouge en attente. */
const PAYMENT_COLORS = { paid: "#1F8A4C", due: PALETTE.danger } as const;

/** Props d'une ligne de membre d'une tontine. */
export interface TontineMemberRowProps {
  readonly member: TontineMember;
  /** Tours du membre, par exemple « Tours 2 et 3 », quand la frise ne les porte pas. */
  readonly turnsLabel?: string;
  /** Couleur de la tontine, présente quand c'est le tour de ce membre : la ligne est cerclée. */
  readonly focusAccent?: string;
  /** Retrait du membre, présent seulement quand l'administrateur peut le retirer. */
  readonly onRemove?: () => void;
  /** Ouvre l'historique de cotisation du membre. */
  readonly onPress?: () => void;
}

/**
 * Affiche un membre avec son avatar, son rôle et l'état de sa cotisation du
 * tour en cours ; son rang de passage est porté par la frise à sa gauche, ou
 * rappelé en toutes lettres dans la liste complète. La ligne du bénéficiaire
 * du tour est cerclée de la couleur de la tontine, comme un champ au focus de
 * shadcn/ui.
 * @param props Membre, tours, couleur de mise en avant, retrait et ouverture de l'historique.
 * @returns La ligne de membre.
 */
export function TontineMemberRow(props: TontineMemberRowProps) {
  const { member, turnsLabel, focusAccent, onRemove, onPress } = props;
  const avatar = { backgroundColor: avatarColor(member.name) };
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
      <View className="h-9 w-9 items-center justify-center rounded-full" style={avatar}>
        <Text className="text-[14px] font-bold text-white">{member.name.slice(0, 1)}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] text-ink" numberOfLines={1}>
          {member.name}
        </Text>
        <MemberDetail
          member={member}
          focused={focused}
          {...(turnsLabel === undefined ? {} : { turnsLabel })}
        />
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
  readonly member: TontineMember;
  readonly turnsLabel?: string;
  /** Vrai quand c'est son tour. */
  readonly focused: boolean;
}

/**
 * Ligne d'état d'un membre : rôle, cotisation en couleur (vert à jour, rouge
 * en attente), tours éventuels et tour en cours, par exemple
 * « Membre · En attente · Tours 2 et 3 · À son tour ».
 * @param props Membre, tours et mise en avant.
 * @returns La ligne d'état.
 */
function MemberDetail(props: MemberDetailProps) {
  const { member, turnsLabel, focused } = props;
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
      {turnsLabel === undefined ? "" : ` · ${turnsLabel}`}
      {focused ? " · À son tour" : ""}
    </Text>
  );
}
