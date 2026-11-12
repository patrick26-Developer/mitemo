import { Pressable, StyleSheet, Text, View } from "react-native";

import type { NotificationItem } from "../../../shared/notifications/hook.notifications";
import { HAIRLINE_WIDTH } from "../../../shared/theme/theme.hairline-width";
import { NotificationVisualView } from "./visual.notification";

/** Fond bleu pâle d'une notification pas encore touchée, comme sur LinkedIn. */
export const UNREAD_BACKGROUND = "#E6EFFC";

/** Props d'une ligne de notification. */
export interface NotificationRowProps {
  readonly item: NotificationItem;
  /** Vrai pour toute ligne qui en suit une autre : un filet les sépare. */
  readonly separated: boolean;
  readonly onPress: () => void;
}

/**
 * Ligne commune à toutes les notifications, sur toute la largeur : visuel,
 * titre sur une ligne, message sur deux, terminés par « … » s'ils sont trop
 * longs, et repère de temps. Une notification pas encore touchée garde un
 * fond bleu pâle et un point bleu.
 * @param props Notification, filet de séparation et ouverture.
 * @returns La ligne touchable.
 */
export function NotificationRow(props: NotificationRowProps) {
  const { item, separated, onPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.message}`}
      accessibilityHint={item.read ? undefined : "Non lue"}
      onPress={onPress}
      className="flex-row items-start gap-3 border-hairline px-5 py-3.5"
      style={[separated ? styles.separated : null, item.read ? null : styles.unread]}
    >
      <NotificationVisualView visual={item.visual} />
      <View className="flex-1 gap-0.5">
        <Text numberOfLines={1} className="text-[15px] font-semibold leading-5 text-ink">
          {item.title}
        </Text>
        <Text numberOfLines={2} className="text-[13px] leading-5 text-muted">
          {item.message}
        </Text>
        <Text numberOfLines={1} className="text-[11px] text-muted">
          {item.time}
        </Text>
      </View>
      {item.read ? null : (
        <View testID="notification-unread" className="mt-2 size-2.5 rounded-full bg-brand" />
      )}
    </Pressable>
  );
}

/** Filet de séparation et fond « non lue », que Tailwind n'exprime pas côté natif. */
const styles = StyleSheet.create({
  separated: { borderTopWidth: HAIRLINE_WIDTH },
  unread: { backgroundColor: UNREAD_BACKGROUND },
});
