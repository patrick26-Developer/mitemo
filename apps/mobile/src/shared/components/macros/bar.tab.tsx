import type { LucideIcon } from "lucide-react-native";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HAIRLINE_WIDTH } from "../../theme/theme.hairline-width";
import { TAB_ICONS } from "../../theme/theme.tab-icons";
import { useConnectionStatus } from "../../hooks/hook.connection-status";
import { ConnectionBar } from "../atoms/bar.connection";
import { TabItem } from "../atoms/item.tab";
import type { NotificationArea } from "../../notifications/model.notification";
import type { BadgeCounts } from "../../notifications/model.notification-badges";
import { badgeLabel } from "../../notifications/model.notification-badges";
import { useNotifications } from "../../notifications/hook.notifications";
import { useSeenWhile } from "../../notifications/hook.seen-while";

/** Onglets de l'application, dans l'ordre où ils sont affichés. */
const TABS: readonly {
  readonly name: string;
  readonly label: string;
  readonly icon: LucideIcon;
  /** Notifications dont l'onglet affiche la pastille. */
  readonly area?: NotificationArea;
}[] = [
  { name: "index", label: "Accueil", icon: TAB_ICONS.home },
  { name: "tontines", label: "Tontines", icon: TAB_ICONS.tontines, area: "tontines" },
  { name: "savings", label: "Cartes", icon: TAB_ICONS.savings, area: "savings" },
  { name: "profile", label: "Profil", icon: TAB_ICONS.profile },
];

/** Marge basse minimale de la barre, en points, au-dessus de la zone sûre. */
const MIN_BOTTOM_INSET = 16;

/**
 * Barre d'onglets commune aux quatre sections de l'application, surmontée de
 * la barre de connexion quand le réseau est coupé ou vient de revenir.
 * @param props État, émetteur d'événements et navigation fournis par Expo Router.
 * @returns La barre d'onglets et l'état de la connexion.
 */
export function AnimatedTabBar(props: BottomTabBarProps) {
  return (
    <View>
      <ConnectionBar status={useConnectionStatus()} />
      <TabShell {...props} />
    </View>
  );
}

/**
 * Compte les pastilles des onglets et marque vues les notifications de
 * l'onglet actif.
 * @param focusedArea Onglet actif qui porte des notifications, `null` sinon.
 * @returns Les compteurs des pastilles.
 */
function useTabBadges(focusedArea: NotificationArea | null): BadgeCounts {
  const notifications = useNotifications();
  useSeenWhile(notifications, focusedArea);
  return notifications.counts;
}

/**
 * Rend les quatre onglets sur la barre blanche arrondie. Tontines et Cartes
 * portent le nombre de tontines ou de cartes qui ont du nouveau depuis la
 * dernière visite ; l'onglet actif marque tout comme vu, et sa pastille ne
 * se rallume qu'une fois quitté.
 * @param props État, émetteur d'événements et navigation fournis par Expo Router.
 * @returns La barre d'onglets.
 */
function TabShell(props: BottomTabBarProps) {
  const { state, emitter, navigateToTab } = props;
  const insets = useSafeAreaInsets();
  const focusedKey = state.routes[state.index]?.key;
  const renderedTabs = TABS.flatMap((tab) => {
    const route = state.routes.find(({ name }) => name === tab.name);
    return route === undefined ? [] : [{ ...tab, route }];
  });
  const focusedArea = renderedTabs.find(({ route }) => route.key === focusedKey)?.area ?? null;
  const counts = useTabBadges(focusedArea);

  const emitTabPress = (routeKey: string) =>
    emitter.emit({ type: "tabPress", target: routeKey, canPreventDefault: true });

  const emitLongPress = (routeKey: string) =>
    emitter.emit({ type: "tabLongPress", target: routeKey });

  return (
    <View
      className="flex-row items-center justify-between rounded-b-[40px] border-t border-hairline bg-white px-5 pt-4"
      style={[styles.shell, { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_INSET) }]}
    >
      {renderedTabs.map(({ route, label, icon, area }) => {
        const focused = route.key === focusedKey;

        const onPress = () => {
          const event = emitTabPress(route.key);
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };

        return (
          <TabItem
            key={route.key}
            focused={focused}
            label={label}
            icon={icon}
            badge={area === undefined || focused ? null : badgeLabel(counts[area])}
            onPress={onPress}
            onLongPress={() => emitLongPress(route.key)}
          />
        );
      })}
    </View>
  );
}

/** Ombre portée et filet d'un demi-point, que Tailwind n'exprime pas. */
const styles = StyleSheet.create({
  shell: {
    borderTopWidth: HAIRLINE_WIDTH,
    borderCurve: "continuous",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
});
