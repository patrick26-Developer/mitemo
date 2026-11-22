/**
 * Permet les versements fictifs sur la base locale de démonstration.
 * @param env Configuration explicite du processus.
 * @returns Si la démonstration utilise exclusivement mitemo_dev en local.
 */
export function localFundingEnabled(env: Readonly<Record<string, string | undefined>>): boolean {
  if (
    env["NODE_ENV"] !== "development" ||
    env["MITEMO_DEMO_AUTH"] !== "true" ||
    env["RENDER"] === "true" ||
    env["MITEMO_DEPLOYMENT"] !== undefined
  )
    return false;
  return usesLocalDevelopmentDatabase(env["DATABASE_URL"] ?? "");
}

function usesLocalDevelopmentDatabase(raw: string): boolean {
  if (!URL.canParse(raw)) return false;
  const url = new URL(raw);
  return (
    ["postgres:", "postgresql:"].includes(url.protocol) &&
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
    url.pathname === "/mitemo_dev"
  );
}
