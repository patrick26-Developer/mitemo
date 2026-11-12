import type { ApiClient, ApiCall } from "./client.http";
import { createIdentityApi } from "./api.identity";
import type { SessionToken, SessionTokenVault } from "./model.session-token";

/** Session renvoyée par l'API après l'OTP. */
const SESSION = {
  accessToken: "jeton-opaque",
  expiresAt: "2026-11-12T11:00:00.000Z",
  user: { userId: "u1", displayName: "Aimée Mbemba", maskedPhoneNumber: "06*****22", role: "USER" },
};

/**
 * Client simulé qui répond par la valeur donnée, ou échoue.
 * @param answer Réponse, ou erreur à lever.
 * @returns Le client et la liste des appels reçus.
 */
function fakeClient(answer: unknown) {
  const calls: ApiCall<unknown>[] = [];
  const client: ApiClient = {
    request: <Body>(call: ApiCall<Body>) => {
      calls.push(call);
      return answer instanceof Error ? Promise.reject(answer) : Promise.resolve(answer as Body);
    },
  };
  return { client, calls };
}

/**
 * Coffre en mémoire.
 * @returns Le coffre et son contenu.
 */
function memoryVault(): SessionTokenVault & { current: () => SessionToken | null } {
  let token: SessionToken | null = { accessToken: "ancien", expiresAt: SESSION.expiresAt };
  return {
    current: () => token,
    load: () => Promise.resolve(token),
    save: (next) => Promise.resolve(void (token = next)),
    clear: () => Promise.resolve(void (token = null)),
  };
}

describe("createIdentityApi", () => {
  it("connecte sans jeton, puis conserve celui de la session ouverte", async () => {
    const { client, calls } = fakeClient(SESSION);
    const vault = memoryVault();

    await createIdentityApi(client, vault).verifyLogin({
      challengeId: "c1" as never,
      otp: "123456",
    });

    expect(calls[0]).toMatchObject({ method: "POST", path: "/auth/verify", auth: false });
    expect(vault.current()).toEqual({ accessToken: "jeton-opaque", expiresAt: SESSION.expiresAt });
  });

  it("ne conserve rien quand la vérification échoue", async () => {
    const { client } = fakeClient(new Error("OTP refusé"));
    const vault = memoryVault();

    await expect(
      createIdentityApi(client, vault).verifyLogin({ challengeId: "c1" as never, otp: "000000" }),
    ).rejects.toThrow();

    expect(vault.current()?.accessToken).toBe("ancien");
  });

  it("protège le profil et encode l'identifiant d'une session à révoquer", async () => {
    const { client, calls } = fakeClient(undefined);
    const identity = createIdentityApi(client, memoryVault());

    await identity.me();
    await identity.revokeSession("a/b");

    expect(calls.map(({ method, path, auth }) => ({ method, path, auth }))).toEqual([
      { method: "GET", path: "/me", auth: true },
      { method: "DELETE", path: "/auth/sessions/a%2Fb", auth: true },
    ]);
  });

  it("efface le jeton local à la déconnexion, même si l'API est injoignable", async () => {
    const { client } = fakeClient(new Error("hors ligne"));
    const vault = memoryVault();

    await expect(createIdentityApi(client, vault).logout()).rejects.toThrow("hors ligne");

    expect(vault.current()).toBeNull();
  });
});
