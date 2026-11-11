import * as Crypto from "expo-crypto";

import type { PinDigest } from "../model/model.pin-credential";

/** Taille du sel, en octets. */
const SALT_BYTES = 16;

/**
 * Empreinte SHA-256 fournie par le système.
 * @param data Chaîne à hacher.
 * @returns L'empreinte en hexadécimal.
 */
export const sha256Digest: PinDigest = (data) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data);

/**
 * Tire un sel aléatoire avec le générateur cryptographique du système.
 * @returns Le sel en hexadécimal.
 */
export function createSalt(): string {
  return Array.from(Crypto.getRandomBytes(SALT_BYTES), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
