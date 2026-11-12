import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Props de l'état vide d'un écran. */
export interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
  /** Icône de l'onglet concerné, affichée au-dessus du titre. */
  readonly icon?: LucideIcon;
}

/**
 * Affiche, centrés dans l'écran, l'icône de l'onglet, un titre et une
 * explication, lorsqu'une liste est vide ou qu'un élément n'existe pas.
 * @param props Titre, explication et icône de l'état vide.
 * @returns Le message d'état vide.
 */
export function EmptyState(props: EmptyStateProps) {
  const { title, message, icon: Icon } = props;

  return (
    <View testID="empty-state" className="flex-1 items-center justify-center gap-2 px-8 py-10">
      {Icon === undefined ? null : (
        <View
          testID="empty-state-icon"
          className="mb-2 size-16 items-center justify-center rounded-full bg-tab-active"
        >
          <Icon size={28} color={PALETTE.tabInk} strokeWidth={2} />
        </View>
      )}
      <Text accessibilityRole="header" className="text-center text-[20px] font-bold text-ink">
        {title}
      </Text>
      <Text className="text-center text-[14px] leading-6 text-muted">{message}</Text>
    </View>
  );
}
