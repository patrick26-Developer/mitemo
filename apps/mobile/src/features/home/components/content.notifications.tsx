import { View } from "react-native";

import { SheetText } from "../../../shared/components/atoms/text.sheet";
import type { NotificationsState } from "../../../shared/notifications/hook.notifications";
import { NotificationRow } from "./row.notification";

/** Props du contenu des notifications. */
export interface NotificationsContentProps {
  readonly notifications: NotificationsState;
  /** Ouvre l'endroit d'une notification, par exemple `/tontine/1?action=pay`. */
  readonly onOpen: (href: string) => void;
}

/**
 * Liste les notifications du membre sur toute la largeur de la feuille,
 * séparées d'un filet ; toucher une ligne la marque lue puis l'ouvre.
 * @param props Notifications et ouverture.
 * @returns La liste, ou le message « à jour ».
 */
export function NotificationsContent(props: NotificationsContentProps) {
  const { items, markRead } = props.notifications;
  if (items.length === 0) {
    return (
      <SheetText>Vous êtes à jour : aucune action n&apos;est attendue pour le moment.</SheetText>
    );
  }

  return (
    <View className="-mx-5">
      {items.map((item, index) => (
        <NotificationRow
          key={item.id}
          item={item}
          separated={index > 0}
          onPress={() => {
            markRead(item.id);
            props.onOpen(item.href);
          }}
        />
      ))}
    </View>
  );
}
