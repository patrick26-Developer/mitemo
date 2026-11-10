import { CalendarDays, LogOut } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { formatDate } from "../../../shared/format/format.date";
import { PALETTE } from "../../../shared/theme/theme.palette";

/** L'icône de sortie regarde vers la gauche : elle est retournée à 180°. */
const LOG_OUT_STYLE = { transform: [{ rotate: "180deg" }] } as const;

/** La ligne de création du compte est une information secondaire, donc atténuée. */
const CREATED_AT_STYLE = { opacity: 0.6 } as const;

/** Props de la section de compte du profil. */
export interface ProfileSignOutProps {
  /** Date de création du compte, en UTC. */
  readonly createdAt: string;
  /** Ouvre la confirmation de déconnexion. */
  readonly onPress?: () => void;
}

/**
 * Affiche la date de création du compte puis l'action de déconnexion, dans la
 * même carte que les autres groupes du profil.
 * @param props Date de création du compte.
 * @returns La section de compte.
 */
export function ProfileSignOut(props: ProfileSignOutProps) {
  const { createdAt, onPress } = props;

  return (
    <View className="px-4">
      <View className="overflow-hidden rounded-[18px] border border-card-border bg-white">
        <View
          testID="account-created-row"
          style={CREATED_AT_STYLE}
          className="flex-row items-center gap-3 border-b border-card-border px-4 py-3.5"
        >
          <CalendarDays size={20} color={PALETTE.muted} />
          <Text className="flex-1 text-[16px] text-muted">
            {`Compte créé le ${formatDate(createdAt)}`}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Se déconnecter"
          onPress={onPress}
          className="flex-row items-center gap-3 px-4 py-3.5"
        >
          <View testID="sign-out-icon" style={LOG_OUT_STYLE}>
            <LogOut size={20} color={PALETTE.danger} />
          </View>
          <Text className="flex-1 text-[16px] font-medium text-danger">Se déconnecter</Text>
        </Pressable>
      </View>
    </View>
  );
}
