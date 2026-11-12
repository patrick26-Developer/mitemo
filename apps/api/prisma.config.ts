import { existsSync } from "node:fs";

import { defineConfig } from "prisma/config";
import { requirePreviewDatabase } from "./src/shared/database/preview-database.js";

if (existsSync(".env")) process.loadEnvFile(".env");

const preview =
  process.env["MITEMO_DEPLOYMENT"] === "preview" ||
  process.env["RENDER_SERVICE_NAME"] === "mitemo-api-dev";
const databaseUrl = preview ? requirePreviewDatabase(process.env) : process.env["DATABASE_URL"];

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
