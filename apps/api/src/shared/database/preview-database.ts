type Environment = Readonly<Record<string, string | undefined>>;

const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);
const NEON_ENDPOINT = /^ep-[a-z0-9-]+(?:\.[a-z0-9-]+)+\.neon\.tech$/;

function validParameters(url: URL): boolean {
  const ssl = url.searchParams.getAll("sslmode");
  const binding = url.searchParams.getAll("channel_binding");
  return (
    ssl.length === 1 &&
    ssl[0] === "verify-full" &&
    binding.length <= 1 &&
    (binding.length === 0 || binding[0] === "require") &&
    [...url.searchParams.keys()].every((key) => key === "sslmode" || key === "channel_binding")
  );
}

function localPreview(url: URL, env: Environment): boolean {
  if (url.search) return false;
  if (url.pathname === "/mitemo_preview") return true;
  return env["NODE_ENV"] === "test" && env["RENDER"] !== "true" && url.pathname === "/mitemo_test";
}

function directNeonEndpoint(url: URL): boolean {
  const endpoint = url.hostname.split(".")[0] ?? "";
  return (
    NEON_ENDPOINT.test(url.hostname) &&
    !endpoint.endsWith("-pooler") &&
    (url.port === "" || url.port === "5432")
  );
}

function pinnedNeonPreview(url: URL, env: Environment): boolean {
  const name = env["MITEMO_PREVIEW_DB_NAME"] ?? "";
  return (
    /^[a-zA-Z0-9_]+$/.test(name) &&
    url.pathname === "/" + name &&
    url.hostname === env["MITEMO_PREVIEW_DB_HOST"] &&
    directNeonEndpoint(url) &&
    validParameters(url)
  );
}

/**
 * Compares the connection target with an independently configured Preview endpoint.
 * @param env Process configuration.
 * @returns Whether the target is a dedicated local database or the pinned direct Neon endpoint.
 */
export function isPreviewDatabase(env: Environment): boolean {
  const raw = env["DATABASE_URL"] ?? "";
  if (!URL.canParse(raw)) return false;
  const url = new URL(raw);
  if (!["postgres:", "postgresql:"].includes(url.protocol) || url.hash) return false;
  if (LOOPBACK.has(url.hostname)) return localPreview(url, env);
  return pinnedNeonPreview(url, env);
}

/**
 * Fails closed before a connection is attempted in Preview.
 * @param env Process configuration.
 * @returns The verified PostgreSQL connection URL.
 * @throws {Error} if the configured identity and connection target do not match.
 */
export function requirePreviewDatabase(env: Environment): string {
  const url = env["DATABASE_URL"];
  if (!url || !isPreviewDatabase(env)) throw new Error("Cible PostgreSQL Preview non vérifiée.");
  return url;
}
