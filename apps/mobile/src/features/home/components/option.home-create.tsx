import type { LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";

/** Props d'un choix de création. */
export interface HomeCreateOptionProps {
  readonly icon: LucideIcon;
  readonly label: string;
  /** Ce que permet ce choix, en une phrase. */
  readonly detail: string;
  readonly onPress: () => void;
}

/**
 * Un choix de création : icône, nom et explication, sur toute la largeur.
 * @param props Icône, nom, explication et action.
 * @returns Le bouton du choix.
 */
export function HomeCreateOption(props: HomeCreateOptionProps) {
  const { icon: Icon, label, detail, onPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${detail}`}
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-[16px] border border-hairline bg-white p-3.5"
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-veil">
        <Icon size={20} color={PALETTE.brand} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] font-semibold text-ink">{label}</Text>
        <Text className="text-[13px] leading-4 text-muted">{detail}</Text>
      </View>
    </Pressable>
  );
}
