/**
 * Date du jour en UTC, au format ISO 8601 sans l'heure (`AAAA-MM-JJ`).
 * @param now Instant de référence, injecté pour les tests.
 * @returns La date du jour en UTC.
 */
export function todayUtc(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * Date du lendemain en UTC, au format ISO 8601 sans l'heure.
 * @param now Instant de référence, injecté pour les tests.
 * @returns La date du lendemain en UTC.
 */
export function tomorrowUtc(now: Date = new Date()): string {
  return new Date(now.getTime() + 86_400_000).toISOString().slice(0, 10);
}
