import { router } from "expo-router";
import { Bell, Search } from "lucide-react-native";
import { View } from "react-native";

import { ActionPill } from "../../../shared/components/atoms/pill.action";
import { useNotifications } from "../../../shared/notifications/hook.notifications";
import { badgeLabel } from "../../../shared/notifications/model.notification-badges";

/** Props des actions rapides de l'accueil. */
export interface HomeActionsProps {
  /** Marge haute de la zone sûre, en points. */
  readonly topInset: number;
  readonly onOpenNotifications: () => void;
}

/**
 * Affiche la recherche et les notifications, posées en haut à droite et
 * toujours visibles pendant le défilement de l'accueil ; la cloche porte le
 * nombre de notifications non lues.
 * @param props Marge de zone sûre et ouverture des notifications.
 * @returns Les actions rapides de l'accueil.
 */
export function HomeActions(props: HomeActionsProps) {
  const { topInset, onOpenNotifications } = props;
  const { counts } = useNotifications();

  return (
    <View className="absolute right-4 z-10" style={{ top: topInset + 12 }}>
      <ActionPill
        variant="raised"
        actions={[
          { icon: Search, label: "Rechercher", onPress: () => router.push("/search") },
          {
            icon: Bell,
            label: "Notifications",
            onPress: onOpenNotifications,
            badge: badgeLabel(counts.bell),
          },
        ]}
      />
    </View>
  );
}
