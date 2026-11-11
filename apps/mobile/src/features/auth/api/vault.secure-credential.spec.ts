import * as SecureStore from "expo-secure-store";

import { PIN_CREDENTIAL_KEY, secureCredentialVault } from "./vault.secure-credential";

jest.mock("expo-secure-store", () => {
  const items = new Map<string, string>();

  return {
    getItemAsync: jest.fn((key: string) => Promise.resolve(items.get(key) ?? null)),
    setItemAsync: jest.fn((key: string, value: string) => {
      items.set(key, value);
      return Promise.resolve();
    }),
    __items: items,
  };
});

/** Stockage simulé, vidé avant chaque test. */
const items = (SecureStore as unknown as { __items: Map<string, string> }).__items;

describe("secureCredentialVault", () => {
  beforeEach(() => items.clear());

  it("ne renvoie rien tant qu'aucun compte n'est créé", async () => {
    await expect(secureCredentialVault.load()).resolves.toBeNull();
  });

  it("relit l'identifiant enregistré", async () => {
    const credential = { phone: "+242 06 570 6622", salt: "abc", hash: "def" };

    await secureCredentialVault.save(credential);

    await expect(secureCredentialVault.load()).resolves.toEqual(credential);
  });

  it("ignore un contenu illisible", async () => {
    items.set(PIN_CREDENTIAL_KEY, "{pas du json");

    await expect(secureCredentialVault.load()).resolves.toBeNull();
  });

  it("ignore un contenu qui n'a pas la forme attendue", async () => {
    items.set(PIN_CREDENTIAL_KEY, JSON.stringify({ phone: 42 }));

    await expect(secureCredentialVault.load()).resolves.toBeNull();
  });
});
