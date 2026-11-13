/** Contact du service client gardé sur l'appareil. */
export interface SupportCache {
  /** Numéro au format E.164. */
  readonly phoneNumber: string;
  /** Instant de réception, en millisecondes depuis l'époque Unix (UTC). */
  readonly fetchedAt: number;
  /** Durée de vie fixée par le backend, en secondes. */
  readonly maxAgeSeconds: number;
}

/**
 * Indique si le numéro en cache peut encore servir sans redemander au backend.
 * @param cache Numéro gardé, `null` s'il n'y en a pas.
 * @param now Instant présent, en millisecondes UTC, injecté pour les tests.
 * @returns `true` tant que la durée de vie n'est pas écoulée.
 */
export function isSupportCacheFresh(cache: SupportCache | null, now: number): boolean {
  return cache !== null && now < cache.fetchedAt + cache.maxAgeSeconds * 1000;
}
