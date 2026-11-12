import type { Href } from "expo-router";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

/**
 * Lit le lien d'une notification touchée, s'il en porte un.
 * @param response Dernier toucher sur une notification.
 * @returns La route à ouvrir, ou `null`.
 */
function tappedUrl(response: Notifications.NotificationResponse | null | undefined): string | null {
  if (response === null || response === undefined) return null;
  if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return null;
  const url = response.notification.request.content.data?.["url"];

  return typeof url === "string" ? url : null;
}

/**
 * Ouvre la carte d'un rappel touché, même quand le toucher a lancé l'app,
 * puis oublie ce toucher pour ne pas rouvrir la carte à chaque rendu.
 */
export function useReminderTap(): void {
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    const url = tappedUrl(response);
    if (url === null) return;

    router.push(url as Href);
    Notifications.clearLastNotificationResponse();
  }, [response]);
}
