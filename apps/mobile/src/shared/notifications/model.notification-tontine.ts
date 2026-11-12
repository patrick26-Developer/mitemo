import { formatAmount } from "../format/format.amount";
import { formatRelativeTime } from "../format/format.relative-time";
import type { Tontine } from "../member/model.portfolio";
import {
  canPayContribution,
  isTontineBeneficiary,
  SELF_MEMBER_ID,
} from "../member/model.portfolio";
import type { TontineActivity, TontineActivityKind } from "../member/model.tontine-activity";
import { selfDue } from "../member/model.tontine-turns";
import type { AppNotification } from "./model.notification";

/** Ce que dit chaque événement du fil, après le nom du membre. */
const ACTIVITY_VERBS: Readonly<Record<TontineActivityKind, string>> = {
  joined: "a rejoint la tontine",
  paid: "a cotisé",
  received: "a reçu son tour",
};

/**
 * Repères communs aux rappels d'une tontine : tour, écran, onglet et sujet.
 * @param tontine Tontine concernée.
 * @returns Les champs partagés par ses rappels.
 */
function reminderBase(tontine: Tontine) {
  return {
    time: `Tour ${tontine.round}`,
    href: `/tontine/${tontine.id}`,
    area: "tontines",
    subject: `tontine:${tontine.id}`,
  } as const;
}

/**
 * Rappel de la cotisation à régler au tour en cours.
 * @param tontine Tontine concernée.
 * @returns Le rappel, avec son icône.
 */
function dueReminder(tontine: Tontine): AppNotification {
  return {
    ...reminderBase(tontine),
    href: `/tontine/${tontine.id}?action=pay`,
    id: `pay-${tontine.id}-${tontine.round}`,
    title: "Cotisation à régler",
    message: `${tontine.name} : ${formatAmount(selfDue(tontine))} FCFA à verser pour ce tour.`,
    visual: { kind: "icon", icon: "due" },
  };
}

/**
 * Rappel de la restourne reçue à la fin du tour en cours.
 * @param tontine Tontine concernée.
 * @returns Le rappel, avec son icône.
 */
function potReminder(tontine: Tontine): AppNotification {
  return {
    ...reminderBase(tontine),
    id: `pot-${tontine.id}-${tontine.round}`,
    title: "Restourne à recevoir",
    message: `Vous recevez la restourne de ${tontine.name} à la fin de ce tour.`,
    visual: { kind: "icon", icon: "pot" },
  };
}

/**
 * Rappels de la tontine pour le membre connecté : cotisation à régler et
 * restourne à recevoir au tour en cours.
 * @param tontine Tontine concernée.
 * @returns Les rappels, chacun avec son icône.
 */
export function tontineReminders(tontine: Tontine): readonly AppNotification[] {
  if (tontine.state !== "ACTIVE") return [];
  const due = canPayContribution(tontine) ? [dueReminder(tontine)] : [];
  const pot = isTontineBeneficiary(tontine) ? [potReminder(tontine)] : [];
  return [...due, ...pot];
}

/**
 * Événements du fil d'une tontine faits par les autres membres : on n'est
 * pas averti de ses propres gestes.
 * @param tontine Tontine concernée.
 * @returns Les événements des autres membres.
 */
export function othersActivity(tontine: Tontine): readonly TontineActivity[] {
  return (tontine.activity ?? []).filter((event) => event.memberId !== SELF_MEMBER_ID);
}

/**
 * Notification d'un événement du fil, avec l'avatar du membre.
 * @param tontine Tontine concernée.
 * @param event Événement à annoncer.
 * @param now Instant de référence, en ISO 8601 UTC.
 * @returns La notification de l'événement.
 */
export function activityNotification(
  tontine: Tontine,
  event: TontineActivity,
  now: string,
): AppNotification {
  return {
    id: `activity-${tontine.id}-${event.id}`,
    title: `${event.memberName} ${ACTIVITY_VERBS[event.kind]}`,
    message: `${tontine.name} · tour ${event.round}`,
    time: formatRelativeTime(event.at, now),
    visual: { kind: "avatar", name: event.memberName },
    href: `/tontine/${tontine.id}?member=${event.memberId}`,
    area: "tontines",
    subject: `tontine:${tontine.id}`,
  };
}
