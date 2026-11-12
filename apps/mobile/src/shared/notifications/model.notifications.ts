import { formatLongDate } from "../format/format.date";
import type { ReceivedInvitation } from "../member/model.invitation";
import type { SavingsCard, Tontine } from "../member/model.portfolio";
import { remainingMarkers } from "../member/model.portfolio";
import type { AppNotification } from "./model.notification";
import {
  activityNotification,
  othersActivity,
  tontineReminders,
} from "./model.notification-tontine";

/** Nombre maximal de notifications gardées dans la feuille. */
const MAX_NOTIFICATIONS = 30;

/** Données du membre dont on déduit les notifications. */
export interface NotificationSources {
  readonly tontines: readonly Tontine[];
  readonly cards: readonly SavingsCard[];
  readonly invitations: readonly ReceivedInvitation[];
  /** Instant de référence, en ISO 8601 UTC (horloge injectée). */
  readonly now: string;
}

/**
 * Notification d'une invitation reçue, avec l'avatar de qui invite.
 * @param invitation Invitation reçue.
 * @returns La notification, qui ouvre la tontine à rejoindre.
 */
function invitationNotification(invitation: ReceivedInvitation): AppNotification {
  return {
    id: `invitation-${invitation.id}`,
    title: `${invitation.invitedBy} vous invite`,
    message: `Rejoignez « ${invitation.tontine.name} » et choisissez vos tours.`,
    time: "À répondre",
    visual: { kind: "avatar", name: invitation.invitedBy },
    href: `/invitation/${invitation.id}`,
    area: "tontines",
    subject: `tontine:${invitation.tontine.id}`,
  };
}

/**
 * Notification d'une carte de pointage en cours.
 * @param card Carte concernée.
 * @returns La notification, qui ouvre la carte.
 */
function cardNotification(card: SavingsCard): AppNotification {
  return {
    id: `card-${card.id}`,
    title: "Carte en cours",
    message: `${card.name} : ${remainingMarkers(card)} marqueurs restants sur ${card.markersTotal}.`,
    time: `Avant le ${formatLongDate(card.deadline)}`,
    visual: { kind: "icon", icon: "card" },
    href: `/savings-detail/${card.id}?action=pay`,
    area: "savings",
    subject: `card:${card.id}`,
  };
}

/**
 * Fil des autres membres de toutes les tontines, du plus récent au plus ancien.
 * @param tontines Tontines du membre.
 * @param now Instant de référence, en ISO 8601 UTC.
 * @returns Les notifications du fil.
 */
function activityFeed(tontines: readonly Tontine[], now: string): readonly AppNotification[] {
  return tontines
    .flatMap((tontine) => othersActivity(tontine).map((event) => ({ tontine, event })))
    .sort((left, right) => Date.parse(right.event.at) - Date.parse(left.event.at))
    .map(({ tontine, event }) => activityNotification(tontine, event, now));
}

/**
 * Construit les notifications du membre, toutes sur le même modèle : d'abord
 * ce qui attend une action (invitations, cotisations, restournes), puis le
 * fil des autres membres, enfin les cartes en cours.
 * @param sources Tontines, cartes, invitations et instant de référence.
 * @returns Les notifications, trente au plus.
 */
export function buildNotifications(sources: NotificationSources): readonly AppNotification[] {
  const { tontines, cards, invitations, now } = sources;
  return [
    ...invitations.map(invitationNotification),
    ...tontines.flatMap(tontineReminders),
    ...activityFeed(tontines, now),
    ...cards.filter((card) => card.state === "ACTIVE").map(cardNotification),
  ].slice(0, MAX_NOTIFICATIONS);
}
