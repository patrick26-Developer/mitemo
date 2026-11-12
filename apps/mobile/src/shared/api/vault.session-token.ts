import * as SecureStore from "expo-secure-store";
import { z } from "zod";

import type { SessionToken, SessionTokenVault } from "./model.session-token";

/** Clé du jeton de session dans le trousseau. */
export const SESSION_TOKEN_KEY = "mitemo-session-token";

/**
 * Le jeton n'est lisible que téléphone déverrouillé, et reste sur cet
 * appareil : il ne part ni dans les sauvegardes, ni vers un autre téléphone.
 */
const STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/** Forme attendue du jeton relu, validée avant tout usage. */
const TOKEN_SCHEMA = z.object({ accessToken: z.string().min(1), expiresAt: z.iso.datetime() });

/**
 * Relit le jeton conservé et ignore un contenu illisible.
 * @param raw Contenu du trousseau.
 * @returns Le jeton, ou `null` s'il est illisible ou incomplet.
 */
function parseToken(raw: string): SessionToken | null {
  try {
    const result = TOKEN_SCHEMA.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

/**
 * Coffre du jeton de session dans le trousseau du téléphone (Keychain iOS,
 * Keystore Android), jamais dans le stockage non chiffré de l'application.
 */
export const secureSessionTokenVault: SessionTokenVault = {
  /**
   * Relit le jeton conservé.
   * @returns Le jeton, ou `null` sans session valide.
   */
  async load() {
    const raw = await SecureStore.getItemAsync(SESSION_TOKEN_KEY, STORE_OPTIONS);
    return raw === null ? null : parseToken(raw);
  },
  /**
   * Conserve le jeton, en remplaçant le précédent.
   * @param token Jeton à conserver.
   */
  async save(token) {
    await SecureStore.setItemAsync(SESSION_TOKEN_KEY, JSON.stringify(token), STORE_OPTIONS);
  },
  /** Efface le jeton : déconnexion ou session refusée par l'API. */
  async clear() {
    await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY, STORE_OPTIONS);
  },
};
