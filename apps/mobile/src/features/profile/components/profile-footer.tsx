import Constants from "expo-constants";
import { Text, View } from "react-native";

import { formatDate } from "../../../shared/format/format-date";

/** Nom de l'application, repris de la configuration Expo. */
const APP_NAME = Constants.expoConfig?.name ?? "Mitemo";

/** Version de l'application, reprise de la configuration Expo. */
const APP_VERSION = Constants.expoConfig?.version ?? "0.0.0";

/** Props du pied de page du profil. */
export interface ProfileFooterProps {
  /** Date de création du compte, en UTC. */
  readonly createdAt: string;
}

/**
 * Affiche la date de création du compte, puis le nom et la version de l'application.
 * @param props Date de création du compte.
 * @returns Le pied de page du profil.
 */
export function ProfileFooter(props: ProfileFooterProps) {
  const { createdAt } = props;

  return (
    <View className="items-center gap-1 px-4">
      <Text className="text-[12px] text-muted">{`Compte créé le ${formatDate(createdAt)}`}</Text>
      <Text className="text-[12px] font-medium text-ink">{APP_NAME}</Text>
      <Text className="text-[12px] text-muted">{`version ${APP_VERSION}`}</Text>
    </View>
  );
}
