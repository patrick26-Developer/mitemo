/** Port d'authentification : une session refusée doit lever une erreur. */
export interface SessionAuthenticator {
  /**
   * Vérifie le Bearer ; le garde n'a pas besoin de connaître le profil retourné.
   * @param authorization En-tête d'authentification externe.
   * @returns Une preuve de session dont le garde n'utilise pas les données.
   * @throws {Error} si la session est absente, expirée ou révoquée.
   */
  profile(authorization: string | undefined): Promise<unknown>;
}

/** Jeton d'injection du port, sans dépendance du domaine à NestJS ou Prisma. */
export const SESSION_AUTHENTICATOR = Symbol("SessionAuthenticator");
