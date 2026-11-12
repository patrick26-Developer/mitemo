import { ChevronRight, Mail } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";

/** Props de la ligne des invitations reçues. */
export interface InvitationsBannerProps {
  readonly count: number;
  readonly onPress: () => void;
}

/**
 * Signale les invitations reçues en haut de la liste des tontines, sur une
 * seule ligne ; elle disparaît quand il n'y en a aucune.
 * @param props Nombre d'invitations et ouverture de la feuille.
 * @returns La ligne des invitations, ou rien.
 */
export function InvitationsBanner(props: InvitationsBannerProps) {
  const { count, onPress } = props;
  if (count === 0) return null;
  const label = count === 1 ? "1 invitation à une tontine" : `${count} invitations à des tontines`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="mb-4 flex-row items-center gap-3 rounded-[14px] border border-card-border bg-white px-4 py-3"
    >
      <View className="size-9 items-center justify-center rounded-full bg-tab-active">
        <Mail size={18} color={PALETTE.tabInk} />
      </View>
      <Text className="flex-1 text-[15px] font-semibold text-ink">{label}</Text>
      <ChevronRight size={18} color={PALETTE.muted} />
    </Pressable>
  );
}
