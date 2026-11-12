import { useEffect } from "react";

import type { SeenScope } from "./model.notification-badges";
import { inScope } from "./model.notification-badges";
import type { NotificationsState } from "./hook.notifications";

/** Séparateur des identifiants dans la clé de l'effet. */
const SEPARATOR = "\n";

/**
 * Marque vues les notifications d'un endroit tant qu'il est ouvert (onglet
 * actif, feuille de la cloche ouverte) : celles qui arrivent pendant ce
 * temps ne rallument pas sa pastille.
 * @param notifications Notifications et marques du membre.
 * @param scope Endroit ouvert, ou `null` quand aucun ne l'est.
 */
export function useSeenWhile(notifications: NotificationsState, scope: SeenScope | null): void {
  const { items, markSeen } = notifications;
  const key =
    scope === null
      ? ""
      : inScope(items, scope)
          .map((item) => item.id)
          .join(SEPARATOR);
  useEffect(() => {
    if (scope !== null && key !== "") markSeen(scope, key.split(SEPARATOR));
  }, [scope, key, markSeen]);
}
