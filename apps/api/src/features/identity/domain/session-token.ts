import { createHash, randomBytes } from "node:crypto";

/**
 * Issues an opaque bearer token with 256 bits of entropy.
 * @returns The bearer token to return to the client.
 */
export function issueSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Derives the database lookup key without persisting the bearer credential.
 * @param token Opaque bearer token.
 * @returns SHA-256 digest in hexadecimal.
 */
export function digestSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
