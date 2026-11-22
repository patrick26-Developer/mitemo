import { createHmac, timingSafeEqual } from "node:crypto";

/** Vérification d'un laissez-passer sans conserver la clé dans le client. */
interface AdmissionVerification {
  readonly secret: string;
  /** Horloge injectée, en secondes UTC depuis l'époque Unix. */
  readonly now: number;
}

function integerTime(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}

function validTimes(issued: unknown, expires: unknown, now: number): boolean {
  if (!integerTime(issued) || !integerTime(expires)) return false;
  return issued <= now + 30 && expires > now && expires > issued && expires - issued <= 28_800;
}

function validClaims(value: unknown, now: number): boolean {
  if (!value || typeof value !== "object") return false;
  const claims = value as Record<string, unknown>;
  return claims["aud"] === "mitemo-preview" && validTimes(claims["iat"], claims["exp"], now);
}

function authentic(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret)
    .update("mitemo.preview.admission.v1." + payload)
    .digest();
  const supplied = Buffer.from(signature, "base64url");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function decodedClaims(payload: string, now: number): boolean {
  try {
    return validClaims(JSON.parse(Buffer.from(payload, "base64url").toString("utf8")), now);
  } catch (error) {
    if (error instanceof SyntaxError) return false;
    throw error;
  }
}

function validInput(token: unknown, secret: string): token is string {
  return typeof token === "string" && token.length <= 2048 && secret.length >= 32;
}

/**
 * Vérifie une admission signée valable huit heures au maximum, jamais une clé embarquée.
 * @param token Laissez-passer opaque fourni par le testeur.
 * @param verification Secret serveur et horloge injectée.
 * @returns Vrai uniquement pour une signature et des droits valides.
 */
export function verifyPreviewAdmission(
  token: unknown,
  verification: AdmissionVerification,
): boolean {
  if (!validInput(token, verification.secret)) return false;
  const match = /^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]{43})$/.exec(token);
  const payload = match?.[1];
  const signature = match?.[2];
  if (!payload || !signature) return false;
  return (
    authentic(payload, signature, verification.secret) && decodedClaims(payload, verification.now)
  );
}
