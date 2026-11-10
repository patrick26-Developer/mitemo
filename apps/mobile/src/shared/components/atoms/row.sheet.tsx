import type { LucideIcon } from "lucide-react-native";
import { Check } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Props d'une ligne de feuille. */
export interface SheetRowProps {
  readonly label: string;
  /** Valeur secondaire affichée à droite, par exemple le thème courant. */
  readonly value?: string;
  /** Explication affichée sous le libellé. */
  readonly description?: string;
  /** Icône posée à gauche du libellé. */
  readonly icon?: LucideIcon;
  /** Marque la ligne comme choix courant. */
  readonly selected?: boolean;
  readonly onPress?: () => void;
  readonly testID?: string;
}

/**
 * Affiche une ligne de feuille : libellé, valeur éventuelle et coche du choix.
 * @param props Libellé, description, icône, valeur, sélection et action.
 * @returns La ligne de feuille.
 */
export function SheetRow(props: SheetRowProps) {
  const { label, value, description, icon: Icon, selected = false, onPress, testID } = props;
  const iconColor = selected ? PALETTE.brand : PALETTE.muted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      testID={testID}
      onPress={onPress}
      className={`flex-row items-center gap-3 rounded-[14px] border px-4 py-3.5 ${
        selected ? "border-brand bg-brand-veil" : "border-card-border bg-white"
      }`}
    >
      {Icon ? (
        <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-veil">
          <Icon size={18} color={iconColor} />
        </View>
      ) : null}
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] text-ink">{label}</Text>
        {description ? (
          <Text className="text-[12px] leading-4 text-muted">{description}</Text>
        ) : null}
      </View>
      {value ? <Text className="text-[13px] text-muted">{value}</Text> : null}
      {selected ? <Check size={16} color={PALETTE.brand} strokeWidth={2.6} /> : null}
    </Pressable>
  );
}
