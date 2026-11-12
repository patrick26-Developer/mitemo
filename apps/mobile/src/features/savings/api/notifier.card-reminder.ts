import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { CardReminder } from "../model/model.card-reminder";

/** Canal Android des rappels de cotisation. */
export const REMINDER_CHANNEL_ID = "cotisations";

/**
 * Lien ouvert quand le membre touche le rappel : la carte à verser.
 * @param reminder Rappel notifié.
 * @returns La route de la carte.
 */
export function reminderUrl(reminder: CardReminder): string {
  return `/savings-detail/${reminder.cardId}`;
}

/**
 * Prépare l'envoi des rappels : crée le canal Android, qui doit exister avant
 * la demande d'autorisation, puis obtient l'accord du membre.
 * @returns Vrai quand les notifications sont autorisées.
 */
export async function allowReminders(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: "Rappels de cotisation",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  if ((await Notifications.getPermissionsAsync()).granted) return true;

  return (await Notifications.requestPermissionsAsync()).granted;
}

/**
 * Affiche tout de suite un rappel sur le téléphone, notification locale sans
 * serveur. Son identifiant évite de doubler un rappel déjà présent.
 * @param reminder Rappel à afficher.
 */
export async function presentReminder(reminder: CardReminder): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    identifier: reminder.id,
    content: { title: reminder.title, body: reminder.body, data: { url: reminderUrl(reminder) } },
    trigger: Platform.OS === "android" ? { channelId: REMINDER_CHANNEL_ID } : null,
  });
}
