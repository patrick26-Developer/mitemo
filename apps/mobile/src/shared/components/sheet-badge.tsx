import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { PALETTE } from "../theme/palette";

/** Props d'une pastille de statut de feuille. */
export interface SheetBadgeProps {
  readonly icon: LucideIcon;
  readonly label: string;
}

/**
 * Affiche un statut court, illustré par une icône, dans une feuille.
 * @param props Icône et libellé du statut.
 * @returns La pastille de statut.
 */
export function SheetBadge(props: SheetBadgeProps) {
  const { icon: Icon, label } = props;

  return (
    <View className="flex-row items-center gap-2 self-start rounded-full bg-brand-veil px-3 py-1.5">
      <Icon size={16} color={PALETTE.brand} />
      <Text className="text-[13px] font-medium text-brand">{label}</Text>
    </View>
  );
}
