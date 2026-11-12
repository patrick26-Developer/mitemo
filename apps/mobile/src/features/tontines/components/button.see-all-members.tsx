import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Pressable, Text } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";

/** Props du lien vers la liste complète des membres. */
export interface SeeAllMembersButtonProps {
  readonly tontineId: string;
  /** Nombre de membres et d'invités, annoncé dans le libellé. */
  readonly count: number;
}

/**
 * Ouvre la liste complète des membres, avec recherche et filtres, quand
 * l'aperçu du détail ne les montre pas tous.
 * @param props Tontine et nombre de membres.
 * @returns Le bouton « Voir tous les membres ».
 */
export function SeeAllMembersButton(props: SeeAllMembersButtonProps) {
  const { tontineId, count } = props;
  const label = `Voir tous les membres (${count})`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.push(`/tontine-members/${tontineId}`)}
      className="flex-row items-center justify-center gap-1 rounded-[14px] border border-card-border py-3"
    >
      <Text className="text-[14px] font-semibold text-tab-ink">{label}</Text>
      <ChevronRight size={16} color={PALETTE.tabInk} />
    </Pressable>
  );
}
