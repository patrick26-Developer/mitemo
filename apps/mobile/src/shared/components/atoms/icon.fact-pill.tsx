import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Props de l'icône d'une ligne d'information. */
export interface FactPillIconProps {
  readonly icon: LucideIcon;
  readonly testID?: string;
}

/**
 * Pose la petite icône d'une ligne d'information dans une pastille claire,
 * lisible sur la teinte d'une carte récapitulative.
 * @param props Icône et identifiant de test.
 * @returns La pastille et son icône.
 */
export function FactPillIcon(props: FactPillIconProps) {
  const { icon: Icon, testID } = props;

  return (
    <View testID={testID} className="size-6 items-center justify-center rounded-full bg-white/70">
      <Icon size={13} color={PALETTE.ink} strokeWidth={2.2} />
    </View>
  );
}
