import { createHash, randomBytes, randomUUID as nodeRandomUUID } from "node:crypto";

/**
 * Double de test d'`expo-crypto` : le module natif n'existe pas hors de
 * l'appareil. Les mêmes primitives sont fournies par `node:crypto`.
 */

/** Algorithmes d'empreinte utilisés par l'application. */
export const CryptoDigestAlgorithm = { SHA256: "SHA-256" };

/**
 * Tire un UUID v4.
 * @returns {string} L'UUID.
 */
export function randomUUID() {
  return nodeRandomUUID();
}

/**
 * Tire des octets aléatoires.
 * @param {number} count Nombre d'octets.
 * @returns {Uint8Array} Les octets.
 */
export function getRandomBytes(count) {
  return new Uint8Array(randomBytes(count));
}

/**
 * Calcule l'empreinte SHA-256 d'une chaîne.
 * @param {string} _algorithm Algorithme demandé, toujours SHA-256 ici.
 * @param {string} data Chaîne à hacher.
 * @returns {Promise<string>} L'empreinte en hexadécimal.
 */
export function digestStringAsync(_algorithm, data) {
  return Promise.resolve(createHash("sha256").update(data).digest("hex"));
}
