import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { isPreviewDatabase } from "./preview-database.js";

type Environment = Readonly<Record<string, string | undefined>>;
type Result = "success" | "invalid-target" | "migration-failed";

const PREVIEW_ENDPOINT = "ep-frosty-tree-be1lox57";
const PREVIEW_DATABASE = "neondb";

function isDemoConfigured(env: Environment): boolean {
  return (
    env["MITEMO_DEPLOYMENT"] === "preview" &&
    env["MITEMO_DEMO_AUTH"] === "true" &&
    (env["MITEMO_PREVIEW_KEY"]?.length ?? 0) >= 32
  );
}

function allowsMigration(env: Environment): boolean {
  return (
    isDemoConfigured(env) &&
    env["MITEMO_PREVIEW_DB_HOST"]?.split(".")[0] === PREVIEW_ENDPOINT &&
    env["MITEMO_PREVIEW_DB_NAME"] === PREVIEW_DATABASE &&
    env["NODE_TLS_REJECT_UNAUTHORIZED"] !== "0" &&
    isPreviewDatabase(env)
  );
}

/**
 * Runs a migration only against the designated Neon Preview compute.
 * @param env Explicitly supplied process configuration.
 * @param migrate Prisma subprocess adapter.
 * @returns A redacted outcome.
 */
export function runPreviewMigration(
  env: Environment,
  migrate: (environment: Environment) => boolean,
): Result {
  if (!allowsMigration(env)) return "invalid-target";
  try {
    return migrate(env) ? "success" : "migration-failed";
  } catch {
    return "migration-failed";
  }
}

function deploy(env: Environment): boolean {
  const apiRoot = new URL("../../../", import.meta.url);
  const cli = fileURLToPath(new URL("node_modules/prisma/build/index.js", apiRoot));
  return (
    spawnSync(process.execPath, [cli, "migrate", "deploy"], {
      cwd: fileURLToPath(apiRoot),
      env,
      stdio: "ignore",
    }).status === 0
  );
}

if (import.meta.main) {
  const result = runPreviewMigration(process.env, deploy);
  if (result === "success") {
    process.stdout.write("Migrations Prisma Preview appliquées.\n");
  } else {
    process.stderr.write(
      result === "invalid-target"
        ? "Migration refusée : configuration ou cible Preview invalide.\n"
        : "Échec de Prisma migrate deploy sur Preview.\n",
    );
    process.exitCode = 1;
  }
}
