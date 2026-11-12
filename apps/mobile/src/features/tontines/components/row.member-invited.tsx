import { X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import type { PendingInvitation } from "../../../shared/member/model.portfolio";
import { PALETTE } from "../../../shared/theme/theme.palette";

/** Props d'une invitation en attente dans la liste des membres. */
export interface InvitedMemberRowProps {
  readonly invitation: PendingInvitation;
  /** Annule l'invitation, présent seulement pour l'administrateur avant le départ. */
  readonly onCancel?: () => void;
}

/**
 * Affiche un contact invité qui n'a pas encore répondu : grisé, avec un
 * avatar en pointillés, car il ne fait pas partie de la tontine tant qu'il
 * n'a pas accepté.
 * @param props Invitation et annulation éventuelle.
 * @returns La ligne de l'invitation.
 */
export function InvitedMemberRow(props: InvitedMemberRowProps) {
  const { invitation, onCancel } = props;

  return (
    <View className="flex-row items-center gap-3 rounded-[14px] border border-dashed border-card-border px-4 py-3">
      <View
        accessibilityLabel={`${invitation.name}, invitation envoyée`}
        className="flex-1 flex-row items-center gap-3"
        style={{ opacity: 0.6 }}
      >
        <View className="h-9 w-9 items-center justify-center rounded-full border border-dashed border-muted">
          <Text className="text-[14px] font-bold text-muted">{invitation.name.slice(0, 1)}</Text>
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-[15px] text-ink" numberOfLines={1}>
            {invitation.name}
          </Text>
          <Text className="text-[12px] text-muted">Invitation envoyée</Text>
        </View>
      </View>
      {onCancel === undefined ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Annuler l'invitation de ${invitation.name}`}
          hitSlop={8}
          onPress={onCancel}
        >
          <X size={18} color={PALETTE.muted} />
        </Pressable>
      )}
    </View>
  );
}
