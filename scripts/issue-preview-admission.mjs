import { createHmac } from "node:crypto";

/**
 * Signe un laissez-passer testeur temporaire ; le secret ne quitte pas l'opérateur.
 * @param {{ secret: string, now: number, ttlSeconds: number }} input Clé et temps UTC en secondes.
 * @returns {string} Laissez-passer destiné au trousseau du téléphone.
 * @throws {Error} si la clé, l'instant ou la durée sont invalides.
 */
export function issuePreviewAdmission(input) {
  if (input.secret.length < 32 || !Number.isSafeInteger(input.now))
    throw new Error("Configuration invalide.");
  if (!Number.isSafeInteger(input.ttlSeconds) || input.ttlSeconds < 60 || input.ttlSeconds > 28_800)
    throw new Error("Durée invalide.");
  const payload = Buffer.from(
    JSON.stringify({ aud: "mitemo-preview", iat: input.now, exp: input.now + input.ttlSeconds }),
  ).toString("base64url");
  const signature = createHmac("sha256", input.secret)
    .update("mitemo.preview.admission.v1." + payload)
    .digest("base64url");
  return payload + "." + signature;
}

if (import.meta.main) {
  const secret = process.env["MITEMO_PREVIEW_KEY"] ?? "";
  if (process.env["MITEMO_DEPLOYMENT"] !== "preview") throw new Error("Preview uniquement.");
  process.stdout.write(
    issuePreviewAdmission({ secret, now: Math.floor(Date.now() / 1000), ttlSeconds: 3600 }) + "\n",
  );
}
