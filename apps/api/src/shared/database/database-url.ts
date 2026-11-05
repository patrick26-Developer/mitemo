/**
 * Levée au démarrage quand `DATABASE_URL` est absente ou vide. L'API ne doit
 * jamais démarrer silencieusement sans connexion à la base.
 */
export class MissingDatabaseUrlError extends Error {
  override readonly name = "MissingDatabaseUrlError";

  constructor() {
    super("DATABASE_URL est requise (connexion directe, non poolée) : voir .env.example");
  }
}

/**
 * Lit l'URL de connexion directe à PostgreSQL depuis l'environnement.
 * @param raw Valeur brute de la variable DATABASE_URL.
 * @returns L'URL, inchangée.
 * @throws {MissingDatabaseUrlError} si la variable est absente ou vide.
 */
export function readDatabaseUrl(raw: string | undefined): string {
  if (raw === undefined || raw.length === 0) throw new MissingDatabaseUrlError();
  return raw;
}
