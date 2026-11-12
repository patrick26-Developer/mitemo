/** Icônes des notifications qui ne viennent pas d'une personne. */
export const NOTIFICATION_ICONS = ["due", "pot", "card"] as const;

/** Icône d'une notification. Voir {@link NOTIFICATION_ICONS}. */
export type NotificationIcon = (typeof NOTIFICATION_ICONS)[number];

/**
 * Visuel d'une notification : l'avatar de la personne qui agit (invitation,
 * cotisation d'un membre), ou une icône pour un rappel de l'application.
 */
export type NotificationVisual =
  | { readonly kind: "avatar"; readonly name: string }
  | { readonly kind: "icon"; readonly icon: NotificationIcon };

/** Onglet dont relève une notification, pour sa pastille. */
export type NotificationArea = "tontines" | "savings";

/** Notification affichée dans la feuille, toutes sur le même modèle. */
export interface AppNotification {
  /** Stable : une notification lue le reste tant que son identifiant ne change pas. */
  readonly id: string;
  readonly title: string;
  readonly message: string;
  /** Repère court : « Tour 4 », « Il y a 3 h », une échéance. */
  readonly time: string;
  readonly visual: NotificationVisual;
  /** Écran ouvert au toucher, par exemple `/tontine/1`. */
  readonly href: string;
  readonly area: NotificationArea;
  /**
   * Tontine ou carte concernée, par exemple `tontine:1` ou `card:c1` : la
   * pastille d'un onglet compte les sujets, pas les notifications.
   */
  readonly subject: string;
}
