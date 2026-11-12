import { formatDate } from "./format.date";

/** Seuils en minutes : une heure, un jour, une semaine. */
const HOUR = 60;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Dit depuis combien de temps un événement a eu lieu, à la manière d'un fil
 * d'actualité : minutes, heures, jours, puis la date au-delà d'une semaine.
 * @param at Instant de l'événement, en ISO 8601 UTC.
 * @param now Instant de référence, en ISO 8601 UTC (horloge injectée).
 * @returns Par exemple « Il y a 3 h » ou « 01/10/2026 ».
 */
export function formatRelativeTime(at: string, now: string): string {
  const minutes = Math.floor((Date.parse(now) - Date.parse(at)) / 60_000);
  if (minutes < 1) return "À l'instant";
  if (minutes < HOUR) return `Il y a ${minutes} min`;
  if (minutes < DAY) return `Il y a ${Math.floor(minutes / HOUR)} h`;
  if (minutes < WEEK) return `Il y a ${Math.floor(minutes / DAY)} j`;
  return formatDate(at);
}
