import { Bell, Info, Search } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/palette";
import { HOME_USER } from "../model/home-content";

/**
 * Affiche la salutation, l'avatar du membre et les actions rapides.
 * @returns L'en-tête de l'accueil.
 */
export function HomeHeader() {
  return (
    <View className="mb-[18px] flex-row items-center justify-between px-4">
      <View className="flex-row items-center gap-2.5">
        <View className="h-12 w-12 items-center justify-center rounded-full border border-white bg-avatar">
          <Text className="text-[18px] font-bold text-white">{HOME_USER.avatarInitial}</Text>
        </View>
        <View className="flex-col gap-0.5">
          <Text className="text-[13px] text-on-dark-muted">Bonjour</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-[16px] font-bold text-white">{HOME_USER.name}</Text>
            <Info size={13} color={PALETTE.white} />
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-3 rounded-[22px] border border-on-dark-glass-border bg-on-dark-glass px-3 py-2.5">
        <Pressable accessibilityRole="button" accessibilityLabel="Rechercher" hitSlop={8}>
          <Search size={20} color={PALETTE.white} />
        </Pressable>
        <View className="h-3.5 w-px bg-on-dark-line" />
        <Pressable accessibilityRole="button" accessibilityLabel="Notifications" hitSlop={8}>
          <Bell size={20} color={PALETTE.white} />
        </Pressable>
      </View>
    </View>
  );
}
