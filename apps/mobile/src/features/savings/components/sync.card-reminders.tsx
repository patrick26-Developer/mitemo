import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { useCardReminders } from "../hooks/hook.card-reminders";
import { useReminderTap } from "../hooks/hook.reminder-tap";

/**
 * Comportement d'un rappel reçu pendant que l'app est ouverte : il s'affiche
 * quand même en bannière. Sur Android, sans son, la bannière ne descend pas
 * (documentation expo-notifications).
 */
const FOREGROUND_HANDLER: Notifications.NotificationHandler = {
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
};

/**
 * Branche les rappels de versement des cartes au niveau de l'application :
 * ils partent quel que soit l'écran affiché, et le toucher ouvre la carte.
 * @returns Aucune interface : le composant ne rend rien.
 */
export function CardReminders() {
  useEffect(() => {
    Notifications.setNotificationHandler(FOREGROUND_HANDLER);
  }, []);
  useCardReminders();
  useReminderTap();

  return null;
}
