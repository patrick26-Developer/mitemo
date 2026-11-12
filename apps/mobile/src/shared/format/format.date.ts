/** Format français court : jour, mois et année sur deux et quatre chiffres. */
const SHORT_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

/** Format français long : jour, mois en toutes lettres et année. */
const LONG_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Formate une date au format JJ/MM/AAAA, sans décalage de fuseau.
 * @param isoDate Date ISO 8601 en UTC, par exemple « 2026-03-12 ».
 * @returns La date lisible, par exemple « 12/03/2026 ».
 */
export function formatDate(isoDate: string): string {
  return SHORT_DATE.format(new Date(isoDate));
}

/**
 * Formate une date en toutes lettres, sans décalage de fuseau.
 * @param isoDate Date ISO 8601 en UTC, par exemple « 2026-12-31 ».
 * @returns La date lisible, par exemple « 31 décembre 2026 ».
 */
export function formatLongDate(isoDate: string): string {
  return LONG_DATE.format(new Date(isoDate));
}

/** Fuseau des membres : Brazzaville, UTC+1 toute l'année. */
const MEMBER_TIME_ZONE = "Africa/Brazzaville";

/** Jour du membre, au format JJ/MM/AAAA. */
const MEMBER_DAY = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: MEMBER_TIME_ZONE,
});

/** Heure du membre, sur 24 heures. */
const MEMBER_TIME = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: MEMBER_TIME_ZONE,
});

/**
 * Formate un instant stocké en UTC avec le jour et l'heure du membre, à
 * Brazzaville : l'heure UTC brute serait en retard d'une heure.
 * @param isoInstant Instant ISO 8601 en UTC, par exemple « 2026-11-02T09:15:00.000Z ».
 * @returns L'instant lisible, par exemple « 02/11/2026 à 10:15 ».
 */
export function formatDateTime(isoInstant: string): string {
  const instant = new Date(isoInstant);

  return `${MEMBER_DAY.format(instant)} à ${MEMBER_TIME.format(instant)}`;
}
