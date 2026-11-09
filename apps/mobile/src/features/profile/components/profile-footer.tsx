import Constants from "expo-constants";
import { Text, View } from "react-native";

/** Nom de l'application, repris de la configuration Expo. */
const APP_NAME = Constants.expoConfig?.name ?? "Mitemo";

/** Version de l'application, reprise de la configuration Expo. */
const APP_VERSION = Constants.expoConfig?.version ?? "0.0.0";

/** Props du pied de page du profil. */
export interface ProfileFooterProps {
  /** Année de création du compte. */
  readonly createdAt: string;
}

/**
 * Affiche la date de création du compte, puis le nom et la version de l'application.
 * @param props Année de création du compte.
 * @returns Le pied de page du profil.
 */
export function ProfileFooter(props: ProfileFooterProps) {
  const { createdAt } = props;

  return (
    <View className="items-center gap-1 px-4">
      <Text className="text-[12px] text-muted">{`Compte créé en ${createdAt}`}</Text>
      <Text className="text-[12px] text-muted">{`${APP_NAME} ${APP_VERSION}`}</Text>
    </View>
  );
}
