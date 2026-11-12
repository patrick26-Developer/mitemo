/** Marge avant expiration sous laquelle un jeton n'est plus envoyé, en millisecondes. */
const EXPIRY_MARGIN_MS = 30_000;

/** Jeton de session conservé sur l'appareil : rien d'autre que lui et son expiration. */
export interface SessionToken {
  /** Jeton opaque, envoyé dans `Authorization: Bearer`. Jamais journalisé. */
  readonly accessToken: string;
  /** Expiration, en ISO 8601 UTC. */
  readonly expiresAt: string;
}

/** Coffre du jeton de session : le trousseau du téléphone en production. */
export interface SessionTokenVault {
  load(): Promise<SessionToken | null>;
  save(token: SessionToken): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Indique si un jeton peut encore être envoyé : un jeton expiré, ou qui le
 * sera dans les 30 secondes, n'est jamais mis sur le réseau.
 * @param token Jeton conservé.
 * @param now Instant de référence, en millisecondes depuis l'époque Unix.
 * @returns `true` quand le jeton est utilisable.
 */
export function isTokenUsable(token: SessionToken, now: number): boolean {
  return Date.parse(token.expiresAt) - now > EXPIRY_MARGIN_MS;
}

/**
 * Extrait d'une session ce qui doit être conservé : le jeton et son
 * expiration, sans les données du membre.
 * @param session Session renvoyée par l'API (ou tout objet qui porte le jeton).
 * @returns Le jeton à conserver.
 */
export function sessionTokenOf(session: SessionToken): SessionToken {
  return { accessToken: session.accessToken, expiresAt: session.expiresAt };
}
