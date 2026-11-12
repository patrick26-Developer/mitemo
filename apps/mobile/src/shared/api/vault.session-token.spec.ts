import * as SecureStore from "expo-secure-store";

import { SESSION_TOKEN_KEY, secureSessionTokenVault } from "./vault.session-token";

jest.mock("expo-secure-store", () => {
  const items = new Map<string, string>();

  return {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
    getItemAsync: jest.fn((key: string) => Promise.resolve(items.get(key) ?? null)),
    setItemAsync: jest.fn((key: string, value: string) => {
      items.set(key, value);
      return Promise.resolve();
    }),
    deleteItemAsync: jest.fn((key: string) => {
      items.delete(key);
      return Promise.resolve();
    }),
    __items: items,
  };
});

/** Trousseau simulé, vidé avant chaque test. */
const items = (SecureStore as unknown as { __items: Map<string, string> }).__items;

/** Jeton de session de test. */
const TOKEN = { accessToken: "jeton-opaque", expiresAt: "2026-11-12T11:00:00.000Z" };

describe("secureSessionTokenVault", () => {
  beforeEach(() => items.clear());

  it("garde le jeton dans le trousseau, lisible seulement téléphone déverrouillé, sur cet appareil", async () => {
    await secureSessionTokenVault.save(TOKEN);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      SESSION_TOKEN_KEY,
      JSON.stringify(TOKEN),
      {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      },
    );
    await expect(secureSessionTokenVault.load()).resolves.toEqual(TOKEN);
  });

  it("ignore un contenu illisible ou incomplet", async () => {
    items.set(SESSION_TOKEN_KEY, "{pas du json");
    await expect(secureSessionTokenVault.load()).resolves.toBeNull();

    items.set(SESSION_TOKEN_KEY, JSON.stringify({ accessToken: "" }));
    await expect(secureSessionTokenVault.load()).resolves.toBeNull();
  });

  it("efface le jeton à la déconnexion", async () => {
    await secureSessionTokenVault.save(TOKEN);
    await secureSessionTokenVault.clear();

    await expect(secureSessionTokenVault.load()).resolves.toBeNull();
  });
});
