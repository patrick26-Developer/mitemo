import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

import { requireTestDatabaseUrl } from "./src/shared/database/test-database-url.js";

// Les tests d'intégration ne lisent JAMAIS .env : sa DATABASE_URL pointe sur une base
// Neon de développement, que des migrations ou des données de test ne doivent pas
// toucher. Ils exigent une base dédiée, désignée explicitement par TEST_DATABASE_URL
// (service PostgreSQL en CI, conteneur jetable en local), et refusent de démarrer
// sans elle. Les workers héritent de DATABASE_URL ainsi fixée.
process.env["DATABASE_URL"] = requireTestDatabaseUrl(process.env);

/**
 * Tests d'intégration (`*.int-spec.ts`) contre une vraie base PostgreSQL. La
 * mise en place globale applique les migrations sur cette base avant les tests.
 */
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["src/**/*.int-spec.ts"],
    globalSetup: ["./test/int/global-setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 120_000,
    coverage: {
      provider: "v8",
      // Les tests unitaires excluent les adaptateurs Prisma : leur couverture
      // est mesurée ici, contre une vraie base, et publiée à part.
      include: ["src/features/*/infrastructure/prisma-*.repository.ts"],
      reportsDirectory: "./coverage-int",
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
});
