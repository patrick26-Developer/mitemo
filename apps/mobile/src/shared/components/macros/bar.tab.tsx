import type { LucideIcon } from "lucide-react-native";
import { House, UserRound, UsersRoundCollaboration, Wallet } from "lucide-react-native";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HAIRLINE_WIDTH } from "../../theme/theme.hairline-width";
import { TabItem } from "../atoms/item.tab";

/** Onglets de l'application, dans l'ordre où ils sont affichés. */
const TABS: readonly {
  readonly name: string;
  readonly label: string;
  readonly icon: LucideIcon;
}[] = [
  { name: "index", label: "Accueil", icon: House },
  { name: "tontines", label: "Tontines", icon: UsersRoundCollaboration },
  { name: "savings", label: "Cartes", icon: Wallet },
  { name: "profile", label: "Profil", icon: UserRound },
];

/** Marge basse minimale de la barre, en points, au-dessus de la zone sûre. */
const MIN_BOTTOM_INSET = 16;

/**
 * Barre d'onglets commune aux quatre sections de l'application.
 * @param props État, émetteur d'événements et navigation fournis par Expo Router.
 * @returns La barre d'onglets animée.
 */
export function AnimatedTabBar(props: BottomTabBarProps) {
  const { state, emitter, navigateToTab } = props;
  const insets = useSafeAreaInsets();
  const focusedKey = state.routes[state.index]?.key;
  const renderedTabs = TABS.flatMap((tab) => {
    const route = state.routes.find(({ name }) => name === tab.name);
    return route === undefined ? [] : [{ ...tab, route }];
  });

  const emitTabPress = (routeKey: string) =>
    emitter.emit({ type: "tabPress", target: routeKey, canPreventDefault: true });

  const emitLongPress = (routeKey: string) =>
    emitter.emit({ type: "tabLongPress", target: routeKey });

  return (
    <View
      className="flex-row items-center justify-between rounded-b-[40px] border-t border-hairline bg-white px-5 pt-4"
      style={[styles.shell, { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_INSET) }]}
    >
      {renderedTabs.map(({ route, label, icon }) => {
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
