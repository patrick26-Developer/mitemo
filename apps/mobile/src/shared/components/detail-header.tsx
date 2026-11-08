import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../shared/theme/palette";

/** Props de l'en-tête d'un écran de détail. */
export interface DetailHeaderProps {
  readonly title: string;
}

/**
 * Affiche un bouton de retour et le titre de l'écran de détail.
 * @param props Titre de l'écran.
 * @returns L'en-tête de détail.
 */
export function DetailHeader(props: DetailHeaderProps) {
  const { title } = props;

  return (
    <View className="flex-row items-center gap-3 px-4 pb-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        hitSlop={8}
        onPress={() => router.back()}
        className="h-10 w-10 items-center justify-center rounded-full bg-tab-active"
      >
        <ChevronLeft size={22} color={PALETTE.tabInk} strokeWidth={2.2} />
      </Pressable>
      <Text
        accessibilityRole="header"
        className="flex-1 text-[22px] font-bold text-ink"
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}
