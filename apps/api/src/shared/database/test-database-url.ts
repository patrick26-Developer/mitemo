/**
 * Levée quand les tests d'intégration ne disposent pas d'une base dédiée et
 * jetable. Le message ne contient jamais l'URL, donc jamais de mot de passe.
 */
export class UnsafeTestDatabaseError extends Error {
  override readonly name = "UnsafeTestDatabaseError";
}

/**
 * Désigne la base des tests d'intégration. Ces tests appliquent les migrations
 * et écrivent des écritures que la base interdit ensuite de supprimer : ils ne
 * doivent jamais viser la base Neon de développement de `.env`.
 * @param env Variables d'environnement du processus.
 * @returns L'URL de `TEST_DATABASE_URL`, inchangée.
 * @throws {UnsafeTestDatabaseError} si la variable est absente, illisible ou
 *   désigne une base hébergée chez Neon.
 */
export function requireTestDatabaseUrl(env: Readonly<Record<string, string | undefined>>): string {
  const raw = env["TEST_DATABASE_URL"];
  if (raw === undefined || raw.length === 0) {
    throw new UnsafeTestDatabaseError(
      "TEST_DATABASE_URL est requise : une base PostgreSQL dédiée et jetable (voir apps/api/README.md)",
    );
  }
  let host: string;
  try {
    host = new URL(raw).hostname;
  } catch {
    throw new UnsafeTestDatabaseError("TEST_DATABASE_URL n'est pas une URL de connexion lisible");
  }
  if (host.endsWith(".neon.tech")) {
    throw new UnsafeTestDatabaseError(
      "TEST_DATABASE_URL désigne une base Neon : les tests d'intégration exigent une base jetable",
    );
  }
  return raw;
}
