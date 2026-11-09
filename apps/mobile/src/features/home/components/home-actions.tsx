import { router } from "expo-router";
import { Bell, Search } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { HAIRLINE_WIDTH } from "../../../shared/theme/hairline-width";
import { PALETTE } from "../../../shared/theme/palette";

/** Props des actions rapides de l'accueil. */
export interface HomeActionsProps {
  /** Marge haute de la zone sûre, en points. */
  readonly topInset: number;
  readonly onOpenNotifications: () => void;
}

/**
 * Affiche la recherche et les notifications, posées en haut à droite et
 * toujours visibles pendant le défilement de l'accueil.
 * @param props Marge de zone sûre et ouverture des notifications.
 * @returns Les actions rapides de l'accueil.
 */
export function HomeActions(props: HomeActionsProps) {
  const { topInset, onOpenNotifications } = props;

  return (
    <View className="absolute right-4 z-10" style={{ top: topInset + 12 }}>
      <View
        className="flex-row items-center gap-3 rounded-[22px] border border-card-border bg-white px-3 py-2.5"
        style={styles.pill}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Rechercher"
          hitSlop={8}
          onPress={() => router.push("/search")}
        >
          <Search size={20} color={PALETTE.tabInk} />
        </Pressable>
        <View className="h-3.5 w-px bg-card-border" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          hitSlop={8}
          onPress={onOpenNotifications}
        >
          <Bell size={20} color={PALETTE.tabInk} />
        </Pressable>
      </View>
    </View>
  );
}

/** Ombre douce de la pastille, pour rester lisible au-dessus des cartes. */
const styles = StyleSheet.create({
  pill: {
    borderWidth: HAIRLINE_WIDTH,
    borderCurve: "continuous",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
