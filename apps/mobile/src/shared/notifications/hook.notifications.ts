import { useState } from "react";

import { usePortfolioStore } from "../member/store.portfolio";
import type { AppNotification } from "./model.notification";
import type { BadgeCounts, SeenScope } from "./model.notification-badges";
import { badgeCounts } from "./model.notification-badges";
import { buildNotifications } from "./model.notifications";
import { useNotificationMarksStore } from "./store.notification-marks";

/** Notification et son état de lecture. */
export interface NotificationItem extends AppNotification {
  readonly read: boolean;
}

/** Notifications du membre, compteurs des pastilles et marques. */
export interface NotificationsState {
  readonly items: readonly NotificationItem[];
  readonly counts: BadgeCounts;
  readonly markRead: (id: string) => void;
  readonly markSeen: (scope: SeenScope, ids: readonly string[]) => void;
}

/**
 * Déduit les notifications du portefeuille, leur état de lecture et les
 * pastilles. L'instant de référence est pris au montage de l'écran.
 * @returns Les notifications, les pastilles et les marques.
 */
export function useNotifications(): NotificationsState {
  const tontines = usePortfolioStore((state) => state.tontines);
  const cards = usePortfolioStore((state) => state.cards);
  const invitations = usePortfolioStore((state) => state.invitations);
  const { readIds, seen, markRead, markSeen } = useNotificationMarksStore();
  const [now] = useState(() => new Date().toISOString());
  const notifications = buildNotifications({ tontines, cards, invitations, now });

  return {
    items: notifications.map((item) => ({ ...item, read: readIds.includes(item.id) })),
    counts: badgeCounts(notifications, seen),
    markRead,
    markSeen,
  };
}
