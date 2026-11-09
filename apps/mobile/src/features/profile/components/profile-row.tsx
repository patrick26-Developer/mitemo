import { ChevronRight } from "lucide-react-native";
import { Pressable, Text } from "react-native";

import { PALETTE } from "../../../shared/theme/palette";
import type { ProfileActionContent } from "../model/profile-content";

/** Props d'une action du profil. */
export interface ProfileRowProps {
  readonly action: ProfileActionContent;
  /** Indique la dernière ligne du groupe, qui ne porte pas de filet bas. */
  readonly isLast: boolean;
}

/**
 * Affiche une action du profil, avec son icône et un chevron.
 * @param props Action à afficher et position dans le groupe.
 * @returns La ligne d'action.
 */
export function ProfileRow(props: ProfileRowProps) {
  const { action, isLast } = props;
  const Icon = action.icon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.label}
      className={`flex-row items-center gap-3 px-4 py-3.5 ${isLast ? "" : "border-b border-card-border"}`}
    >
      <Icon size={20} color={PALETTE.muted} />
      <Text className="flex-1 text-[16px] text-ink">{action.label}</Text>
      {action.value ? <Text className="text-[14px] text-muted">{action.value}</Text> : null}
      <ChevronRight size={16} color={PALETTE.muted} />
    </Pressable>
  );
}
