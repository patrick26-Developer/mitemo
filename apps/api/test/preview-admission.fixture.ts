import { createHmac } from "node:crypto";

/**
 * Produit un laissez-passer de test indépendant du validateur de production.
 * @param secret Secret exclusivement réservé aux tests.
 * @param now Instant injecté, en secondes UTC.
 * @returns Une admission d'une heure pour le parcours HTTP.
 */
export function signedTestAdmission(secret: string, now: number): string {
  const payload = Buffer.from(
    JSON.stringify({ aud: "mitemo-preview", iat: now, exp: now + 3600 }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update("mitemo.preview.admission.v1." + payload)
    .digest("base64url");
  return payload + "." + signature;
}
