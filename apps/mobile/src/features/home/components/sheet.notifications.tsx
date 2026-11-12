import { router } from "expo-router";

import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { useNotifications } from "../../../shared/notifications/hook.notifications";
import { useSeenWhile } from "../../../shared/notifications/hook.seen-while";
import { NotificationsContent } from "./content.notifications";

/** Props de la feuille des notifications. */
export interface NotificationsSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Feuille des notifications, toutes sur le même modèle : invitations,
 * cotisations, restournes, fil des autres membres et cartes. Ouvrir la
 * feuille vide la pastille de la cloche ; toucher une notification la marque
 * lue, ferme la feuille et ouvre l'endroit exact qu'elle concerne.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille des notifications.
 */
export function NotificationsSheet(props: NotificationsSheetProps) {
  const { visible, onClose } = props;
  const notifications = useNotifications();
  useSeenWhile(notifications, visible ? "bell" : null);
  const open = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <BottomSheet visible={visible} title="Notifications" onClose={onClose}>
      <NotificationsContent notifications={notifications} onOpen={open} />
    </BottomSheet>
  );
}
