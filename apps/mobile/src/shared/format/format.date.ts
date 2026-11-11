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
