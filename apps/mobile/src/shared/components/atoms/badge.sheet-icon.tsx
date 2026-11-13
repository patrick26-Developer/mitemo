import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Teinte de l'icône d'une feuille. */
export type SheetIconTone = "danger" | "brand";

/** Icône posée en tête d'une feuille, au-dessus de son titre. */
export interface SheetIcon {
  readonly icon: LucideIcon;
  readonly tone: SheetIconTone;
}

/** Fond et trait de chaque teinte. */
const TONES: Readonly<
  Record<SheetIconTone, { readonly background: string; readonly color: string }>
> = {
  danger: { background: "#FDECEA", color: PALETTE.danger },
  brand: { background: "#E6ECFC", color: PALETTE.brand },
};

/** Props du badge d'icône. */
export interface SheetIconBadgeProps {
  readonly sheetIcon: SheetIcon;
}

/**
 * Pastille ronde de l'icône d'une feuille, centrée et bien aérée.
 * @param props Icône et teinte.
 * @returns La pastille.
 */
export function SheetIconBadge(props: SheetIconBadgeProps) {
  const { icon: Icon, tone } = props.sheetIcon;
  const colors = TONES[tone];

  return (
    <View
      testID="sheet-icon"
      className="my-4 h-16 w-16 items-center justify-center self-center rounded-full"
      style={{ backgroundColor: colors.background }}
    >
      <Icon size={30} color={colors.color} strokeWidth={2} />
    </View>
  );
}
