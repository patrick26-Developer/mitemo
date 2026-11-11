/**
 * Date du jour en UTC, au format ISO 8601 sans l'heure (`AAAA-MM-JJ`).
 * @param now Instant de référence, injecté pour les tests.
 * @returns La date du jour en UTC.
 */
export function todayUtc(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
