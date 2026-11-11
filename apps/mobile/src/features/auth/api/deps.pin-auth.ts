import type { PinAuthDeps } from "../model/model.pin-auth";
import { createSalt, sha256Digest } from "./crypto.pin";
import { secureCredentialVault } from "./vault.secure-credential";

/** Vérification locale du code : trousseau du système et SHA-256 salé. */
export const PIN_AUTH_DEPS: PinAuthDeps = {
  vault: secureCredentialVault,
  digest: sha256Digest,
  createSalt,
};
