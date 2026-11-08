import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

import { requireTestDatabaseUrl } from "../../src/shared/database/test-database-url.js";

/**
 * Applique les migrations Prisma sur la base de test avant les tests
 * d'intégration. `migrate deploy` n'efface rien : il applique seulement les
 * migrations manquantes. L'URL est passée explicitement dans l'environnement
 * de la commande, qui l'emporte sur un éventuel `.env` (vérifié avec
 * `process.loadEnvFile`, utilisé par prisma.config.ts).
 */
export default function setup(): void {
  const url = requireTestDatabaseUrl(process.env);
  const prismaCli = createRequire(import.meta.url).resolve("prisma/build/index.js");
  execFileSync(process.execPath, [prismaCli, "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: url },
    stdio: ["ignore", "ignore", "inherit"],
  });
}
