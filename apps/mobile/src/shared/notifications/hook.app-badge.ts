import { setBadgeCountAsync } from "expo-notifications";
import { useEffect } from "react";

import { useNotifications } from "./hook.notifications";

/**
 * Reporte le nombre de notifications non lues sur l'icône de l'application,
 * et l'efface hors session. Une pastille est un plus : un lanceur Android qui
 * ne la gère pas, ou un refus de permission, ne bloque rien.
 * @param signedIn Vrai quand la session du membre est ouverte.
 */
export function useAppBadge(signedIn: boolean): void {
  const total = useNotifications().counts.bell;
  const count = signedIn ? total : 0;
  useEffect(() => {
    setBadgeCountAsync(count).catch(() => false);
  }, [count]);
}
