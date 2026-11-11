import type { CredentialVault } from "./model.credential-vault";
import { createPinCredential, verifyPinCredential } from "./model.pin-credential";
import type { PinAttempt, PinDigest } from "./model.pin-credential";

/** Dépendances de la vérification locale du code, injectées pour les tests. */
export interface PinAuthDeps {
  readonly vault: CredentialVault;
  readonly digest: PinDigest;
  /** Tire un nouveau sel aléatoire. */
  readonly createSalt: () => string;
}

/**
 * Enregistre le code choisi à l'inscription.
 * @param attempt Numéro et code choisis.
 * @param deps Trousseau, empreinte et sel.
 * @returns Toujours vrai une fois le code conservé.
 */
export async function registerPin(attempt: PinAttempt, deps: PinAuthDeps): Promise<boolean> {
  const credential = await createPinCredential(attempt, {
    digest: deps.digest,
    salt: deps.createSalt(),
  });
  await deps.vault.save(credential);

  return true;
}

/**
 * Vérifie le code saisi à la connexion.
 * @param attempt Numéro et code saisis.
 * @param deps Trousseau et empreinte.
 * @returns Vrai si un compte de ce numéro existe ici avec ce code.
 */
export async function checkPin(attempt: PinAttempt, deps: PinAuthDeps): Promise<boolean> {
  const credential = await deps.vault.load();
  if (credential === null) return false;

  return verifyPinCredential(credential, attempt, deps.digest);
}

/**
 * Indique si un compte de ce numéro a été créé sur l'appareil.
 * @param phone Numéro au format international.
 * @param vault Trousseau de l'appareil.
 * @returns Vrai si la connexion peut continuer vers le code.
 */
export async function hasAccount(phone: string, vault: CredentialVault): Promise<boolean> {
  return (await vault.load())?.phone === phone;
}
