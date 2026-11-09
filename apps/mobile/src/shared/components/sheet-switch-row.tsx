import type { LucideIcon } from "lucide-react-native";
import { Switch, Text, View } from "react-native";

import { PALETTE, SWITCH_TRACK_COLORS } from "../theme/palette";

/** Props d'une ligne de feuille avec commutateur. */
export interface SheetSwitchRowProps {
  readonly label: string;
  /** Explication affichée sous le libellé. */
  readonly description: string;
  readonly value: boolean;
  readonly onValueChange: (value: boolean) => void;
  /** Icône posée à gauche du libellé. */
  readonly icon?: LucideIcon;
}

/**
 * Affiche un réglage à activer ou couper, avec son explication et son état.
 * @param props Libellé, description, état, changement et icône éventuelle.
 * @returns La ligne de feuille avec commutateur.
 */
export function SheetSwitchRow(props: SheetSwitchRowProps) {
  const { label, description, value, onValueChange, icon: Icon } = props;

  return (
    <View className="flex-row items-center gap-3 rounded-[14px] border border-card-border px-4 py-3">
      {Icon ? <Icon size={20} color={PALETTE.muted} /> : null}
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] text-ink">{label}</Text>
        <Text className="text-[12px] text-muted">{description}</Text>
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onValueChange}
        trackColor={SWITCH_TRACK_COLORS}
        thumbColor={PALETTE.white}
      />
    </View>
  );
}
