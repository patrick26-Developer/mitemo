import { existsSync } from "node:fs";

import { defineConfig } from "prisma/config";

if (existsSync(".env")) process.loadEnvFile(".env");

const databaseUrl = process.env["DATABASE_URL"];

/**
 * Configuration de la CLI Prisma. Les migrations utilisent DATABASE_URL, la connexion
 * DIRECTE : le pooler de Neon (mode transaction) casse les verrous de migration.
 * L'URL est facultative ici pour que `prisma generate` tourne en CI sans base.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: databaseUrl === undefined ? {} : { url: databaseUrl },
});
