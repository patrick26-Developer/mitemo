import * as SecureStore from "expo-secure-store";
import { z } from "zod";

import type { CredentialVault } from "../model/model.credential-vault";
import type { PinCredential } from "../model/model.pin-credential";

/** Clé de l'identifiant dans le trousseau de l'appareil. */
export const PIN_CREDENTIAL_KEY = "mitemo-pin-credential";

/** Forme attendue du contenu relu, validée à la frontière. */
const CREDENTIAL_SCHEMA = z.object({
  phone: z.string(),
  salt: z.string(),
  hash: z.string(),
});

/**
 * Analyse le contenu relu du trousseau.
 * @param raw Contenu brut.
 * @returns L'identifiant, ou `null` si le contenu est illisible.
 */
function parseCredential(raw: string): PinCredential | null {
  try {
    const result = CREDENTIAL_SCHEMA.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

/**
 * Identifiant conservé dans le trousseau chiffré du système (Keychain sur iOS,
 * Keystore sur Android), jamais dans AsyncStorage.
 */
export const secureCredentialVault: CredentialVault = {
  /**
   * Lit l'identifiant du trousseau et ignore un contenu illisible.
   * @returns L'identifiant, ou `null` si aucun compte valide n'est conservé.
   */
  async load() {
    const raw = await SecureStore.getItemAsync(PIN_CREDENTIAL_KEY);
    return raw === null ? null : parseCredential(raw);
  },
  /**
   * Écrit l'identifiant dans le trousseau, en remplaçant le précédent.
   * @param credential Identifiant à conserver.
   */
  async save(credential) {
    await SecureStore.setItemAsync(PIN_CREDENTIAL_KEY, JSON.stringify(credential));
  },
};
