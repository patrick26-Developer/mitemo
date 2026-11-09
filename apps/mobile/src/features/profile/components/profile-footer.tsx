import Constants from "expo-constants";
import { Text, View } from "react-native";

/** Nom de l'application, repris de la configuration Expo. */
const APP_NAME = Constants.expoConfig?.name ?? "Mitemo";

/** Version de l'application, reprise de la configuration Expo. */
const APP_VERSION = Constants.expoConfig?.version ?? "0.0.0";

/**
 * Affiche le nom et la version de l'application, en pied de profil.
 * @returns Le pied de page du profil.
 */
export function ProfileFooter() {
  return (
    <View className="items-center gap-1 px-4">
      <Text className="text-[12px] font-medium text-ink">{APP_NAME}</Text>
      <Text className="text-[12px] text-muted">{`version ${APP_VERSION}`}</Text>
    </View>
  );
}
