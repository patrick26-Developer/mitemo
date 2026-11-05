import { existsSync } from "node:fs";

import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// Même mécanisme que prisma.config.ts : pas de dotenv, l'API native de Node suffit.
// En CI, DATABASE_URL est déjà fournie par l'environnement : pas de .env à charger.
if (existsSync(".env")) process.loadEnvFile(".env");

/**
 * Tests d'intégration (`*.int-spec.ts`) : exigent une vraie base PostgreSQL
 * atteignable via DATABASE_URL (service en CI, branche Neon personnelle en local).
 * Séparés des tests unitaires pour ne jamais les faire tourner par accident sans base.
 */
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["src/**/*.int-spec.ts"],
    testTimeout: 15_000,
  },
});
