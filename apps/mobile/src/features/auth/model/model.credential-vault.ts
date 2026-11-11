import type { PinCredential } from "./model.pin-credential";

/**
 * Port de conservation de l'identifiant du membre. L'implémentation locale
 * sera remplacée par la vérification de l'API quand la route existera.
 */
export interface CredentialVault {
  /**
   * Lit l'identifiant conservé.
   * @returns L'identifiant, ou `null` si aucun compte n'a été créé ici.
   */
  load(): Promise<PinCredential | null>;
  /**
   * Conserve l'identifiant, en remplaçant le précédent.
   * @param credential Identifiant à conserver.
   */
  save(credential: PinCredential): Promise<void>;
}
