/** Empreinte du code PIN conservée sur l'appareil, jamais le code lui-même. */
export interface PinCredential {
  /** Numéro au format international du compte créé sur l'appareil. */
  readonly phone: string;
  /** Sel aléatoire, en hexadécimal. */
  readonly salt: string;
  /** Empreinte du sel et du code, en hexadécimal. */
  readonly hash: string;
}

/** Numéro et code saisis par le membre. */
export interface PinAttempt {
  readonly phone: string;
  readonly pin: string;
}

/** Calcule l'empreinte d'une chaîne, en hexadécimal. */
export type PinDigest = (data: string) => Promise<string>;

/** Dépendances de la création d'un identifiant, injectées pour les tests. */
export interface PinCredentialDeps {
  readonly digest: PinDigest;
  /** Sel aléatoire propre à ce compte. */
  readonly salt: string;
}

/**
 * Calcule l'empreinte salée d'un code.
 * @param salt Sel du compte.
 * @param pin Code saisi.
 * @param digest Fonction d'empreinte.
 * @returns L'empreinte en hexadécimal.
 */
function hashPin(salt: string, pin: string, digest: PinDigest): Promise<string> {
  return digest(`${salt}:${pin}`);
}

/**
 * Construit l'identifiant à conserver après le choix du code à l'inscription.
 * @param attempt Numéro et code choisis.
 * @param deps Fonction d'empreinte et sel.
 * @returns L'identifiant, sans le code en clair.
 */
export async function createPinCredential(
  attempt: PinAttempt,
  deps: PinCredentialDeps,
): Promise<PinCredential> {
  return {
    phone: attempt.phone,
    salt: deps.salt,
    hash: await hashPin(deps.salt, attempt.pin, deps.digest),
  };
}

/**
 * Vérifie qu'un numéro et un code correspondent à l'identifiant conservé.
 * @param credential Identifiant conservé sur l'appareil.
 * @param attempt Numéro et code saisis.
 * @param digest Fonction d'empreinte.
 * @returns Vrai si le numéro et le code sont les bons.
 */
export async function verifyPinCredential(
  credential: PinCredential,
  attempt: PinAttempt,
  digest: PinDigest,
): Promise<boolean> {
  if (credential.phone !== attempt.phone) return false;

  return (await hashPin(credential.salt, attempt.pin, digest)) === credential.hash;
}
