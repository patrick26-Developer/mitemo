import type { CredentialVault } from "../model/model.credential-vault";
import type { PinAuthDeps } from "../model/model.pin-auth";
import type { PinCredential } from "../model/model.pin-credential";

/** Trousseau en mémoire et contrôle de ses pannes, pour les tests d'écran. */
export interface MemoryPinAuth {
  readonly deps: PinAuthDeps;
  /** Vide le trousseau et rétablit son fonctionnement. */
  reset(): void;
  /** Fait échouer les prochaines lectures du trousseau. */
  breakVault(): void;
}

/** Contenu mutable du trousseau simulé. */
interface MemoryVaultState {
  stored: PinCredential | null;
  broken: boolean;
}

/**
 * Trousseau en mémoire qui lit et écrit dans l'état fourni.
 * @param state Contenu et panne simulée.
 * @returns Le trousseau.
 */
function memoryVault(state: MemoryVaultState): CredentialVault {
  return {
    load: () =>
      state.broken ? Promise.reject(new Error("trousseau")) : Promise.resolve(state.stored),
    save: (credential) => {
      state.stored = credential;
      return Promise.resolve();
    },
  };
}

/**
 * Construit des dépendances d'authentification en mémoire, avec une empreinte
 * lisible, pour remplacer le trousseau du système sous Jest.
 * @returns Les dépendances et leurs commandes.
 */
export function createMemoryPinAuth(): MemoryPinAuth {
  const state: MemoryVaultState = { stored: null, broken: false };

  return {
    deps: {
      vault: memoryVault(state),
      digest: (data) => Promise.resolve(`h(${data})`),
      createSalt: () => "sel",
    },
    reset: () => Object.assign(state, { stored: null, broken: false }),
    breakVault: () => Object.assign(state, { broken: true }),
  };
}
