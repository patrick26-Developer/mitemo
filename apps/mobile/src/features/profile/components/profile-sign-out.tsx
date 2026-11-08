import { LogOut } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/palette";

/**
 * Affiche le bouton de déconnexion du profil.
 * @returns Le bouton de déconnexion.
 */
export function ProfileSignOut() {
  return (
    <View className="px-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Se déconnecter"
        className="flex-row items-center justify-center gap-2 rounded-[18px] border border-card-border py-3.5"
      >
        <LogOut size={18} color={PALETTE.danger} />
        <Text className="text-[16px] font-medium text-danger">Se déconnecter</Text>
      </Pressable>
    </View>
  );
}
