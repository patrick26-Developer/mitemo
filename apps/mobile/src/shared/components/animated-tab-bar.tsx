import type { LucideIcon } from "lucide-react-native";
import { House, Ticket, UserRound, UsersRoundCollaboration } from "lucide-react-native";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HAIRLINE_WIDTH } from "../../shared/theme/hairline-width";
import { TabItem } from "./tab-item";

/** Libellé et icône de chaque onglet, par nom de route Expo Router. */
const TABS: Readonly<Record<string, { label: string; icon: LucideIcon }>> = {
  index: { label: "Accueil", icon: House },
  tontines: { label: "Tontines", icon: UsersRoundCollaboration },
  savings: { label: "Cartes", icon: Ticket },
  profile: { label: "Profil", icon: UserRound },
};

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

  const emitTabPress = (routeKey: string) =>
    emitter.emit({ type: "tabPress", target: routeKey, canPreventDefault: true });

  const emitLongPress = (routeKey: string) =>
    emitter.emit({ type: "tabLongPress", target: routeKey });

  return (
    <View
      className="flex-row items-center justify-between rounded-b-[40px] border-t border-hairline bg-white px-5 pt-4"
      style={[styles.shell, { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_INSET) }]}
    >
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const focused = state.index === index;

        const onPress = () => {
          const event = emitTabPress(route.key);
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };

        return (
          <TabItem
            key={route.key}
            focused={focused}
            label={tab.label}
            icon={tab.icon}
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
