import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { useTabItemAnimation } from "../../shared/hooks/use-tab-item-animation";
import { PALETTE } from "../../shared/theme/palette";

/** Props d'un onglet de la barre de navigation. */
export interface TabItemProps {
  readonly focused: boolean;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly onPress: () => void;
  readonly onLongPress: () => void;
  /** Identifiant de test posé sur l'icône. */
  readonly testID?: string;
}

/**
 * Affiche un onglet : icône seule au repos, icône et libellé quand il est actif.
 * @param props Onglet à afficher et actions de pression.
 * @returns La pastille de l'onglet.
 */
export function TabItem(props: TabItemProps) {
  const { focused, label, icon: Icon, onPress, onLongPress, testID } = props;
  const { pillStyle, labelStyle, iconStyle } = useTabItemAnimation(focused);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      hitSlop={8}
    >
      <Animated.View style={[styles.pill, pillStyle]}>
        <Animated.View style={iconStyle}>
          <Icon
            {...(testID === undefined ? {} : { testID })}
            size={26}
            color={PALETTE.tabInk}
            fill={focused ? PALETTE.tabInk : "none"}
            strokeWidth={1.8}
          />
        </Animated.View>
        <Animated.Text numberOfLines={1} style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

/**
 * Animated.View n'accepte pas de className : la pastille porte l'animation de
 * largeur et de fond, son cadre statique reste donc décrit ici.
 */
const styles = StyleSheet.create({
  pill: {
    paddingVertical: 12,
    paddingLeft: 16,
    borderRadius: 27,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    gap: 8,
  },
  label: { fontSize: 16, fontWeight: "500", color: PALETTE.tabInk },
});
