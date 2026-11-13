import type { LucideIcon } from "lucide-react-native";
import { ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Props d'une ligne de contact du service client. */
export interface SupportContactRowProps {
  readonly icon: LucideIcon;
  readonly label: string;
  /** Numéro affiché sous le libellé. */
  readonly hint: string;
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
}

/**
 * Ligne touchable d'un moyen de contact : icône, libellé, numéro et chevron.
 * @param props Icône, textes et action de la ligne.
 * @returns La ligne de contact.
 */
export function SupportContactRow(props: SupportContactRowProps) {
  const { icon: Icon, label, hint, accessibilityLabel, onPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-[14px] border border-card-border px-4 py-3"
    >
      <Icon size={20} color={PALETTE.brand} />
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] font-semibold text-ink">{label}</Text>
        <Text className="text-[12px] text-muted">{hint}</Text>
      </View>
      <ChevronRight size={18} color={PALETTE.muted} />
    </Pressable>
  );
}
