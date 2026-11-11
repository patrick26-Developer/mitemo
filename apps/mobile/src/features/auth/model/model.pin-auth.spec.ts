import type { CredentialVault } from "./model.credential-vault";
import { checkPin, hasAccount, registerPin } from "./model.pin-auth";
import type { PinAuthDeps } from "./model.pin-auth";
import type { PinCredential } from "./model.pin-credential";

const PHONE = "+242 06 570 6622";

/**
 * Trousseau en mémoire.
 * @returns Le trousseau et un accès à son contenu.
 */
function memoryVault(): CredentialVault & { stored: () => PinCredential | null } {
  let stored: PinCredential | null = null;

  return {
    load: () => Promise.resolve(stored),
    save: (credential) => {
      stored = credential;
      return Promise.resolve();
    },
    stored: () => stored,
  };
}

/**
 * Dépendances de test, avec une empreinte lisible.
 * @param vault Trousseau utilisé.
 * @returns Les dépendances.
 */
function depsWith(vault: CredentialVault): PinAuthDeps {
  return { vault, digest: (data) => Promise.resolve(`h(${data})`), createSalt: () => "sel" };
}

describe("registerPin", () => {
  it("conserve l'empreinte du code, pas le code", async () => {
    const vault = memoryVault();

    await expect(registerPin({ phone: PHONE, pin: "4821" }, depsWith(vault))).resolves.toBe(true);
    expect(vault.stored()).toEqual({ phone: PHONE, salt: "sel", hash: "h(sel:4821)" });
  });
});

describe("checkPin", () => {
  it("refuse tout code tant qu'aucun compte n'existe", async () => {
    await expect(checkPin({ phone: PHONE, pin: "4821" }, depsWith(memoryVault()))).resolves.toBe(
      false,
    );
  });

  it("accepte le code enregistré et refuse les autres", async () => {
    const deps = depsWith(memoryVault());
    await registerPin({ phone: PHONE, pin: "4821" }, deps);

    await expect(checkPin({ phone: PHONE, pin: "4821" }, deps)).resolves.toBe(true);
    await expect(checkPin({ phone: PHONE, pin: "1234" }, deps)).resolves.toBe(false);
  });
});

describe("hasAccount", () => {
  it("reconnaît seulement le numéro du compte créé ici", async () => {
    const vault = memoryVault();
    await expect(hasAccount(PHONE, vault)).resolves.toBe(false);

    await registerPin({ phone: PHONE, pin: "4821" }, depsWith(vault));

    await expect(hasAccount(PHONE, vault)).resolves.toBe(true);
    await expect(hasAccount("+242 05 555 1234", vault)).resolves.toBe(false);
  });
});
