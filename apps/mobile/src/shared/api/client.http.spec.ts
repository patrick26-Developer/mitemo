import { IDEMPOTENCY_KEY_HEADER } from "@mitemo/contracts";
import { z } from "zod";

import type { ApiClientDeps } from "./client.http";
import { createApiClient } from "./client.http";
import { ApiClientError, ApiUnavailableError } from "./error.api";
import type { SessionToken, SessionTokenVault } from "./model.session-token";

/** Instant de référence des tests, en UTC. */
const NOW = Date.parse("2026-11-12T10:00:00.000Z");

/** Jeton valide une heure. */
const TOKEN: SessionToken = { accessToken: "jeton-1", expiresAt: "2026-11-12T11:00:00.000Z" };

/** Session renouvelée par l'API. */
const RENEWED = {
  accessToken: "jeton-2",
  expiresAt: "2026-11-12T12:00:00.000Z",
  user: { userId: "u1", displayName: "Aimée", maskedPhoneNumber: "06*****22", role: "USER" },
};

/** Schéma d'une réponse de test. */
const PING = z.object({ ok: z.literal(true) });

/**
 * Réponse HTTP simulée.
 * @param status Statut HTTP.
 * @param body Corps JSON, absent pour 204.
 * @returns La réponse.
 */
function reply(status: number, body?: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () =>
      body === undefined ? Promise.reject(new SyntaxError("vide")) : Promise.resolve(body),
  } as unknown as Response;
}

/**
 * Coffre en mémoire.
 * @param initial Jeton déjà conservé.
 * @returns Le coffre et son contenu.
 */
function memoryVault(
  initial: SessionToken | null,
): SessionTokenVault & { current: () => SessionToken | null } {
  let token = initial;
  return {
    current: () => token,
    load: () => Promise.resolve(token),
    save: (next) => Promise.resolve(void (token = next)),
    clear: () => Promise.resolve(void (token = null)),
  };
}

/**
 * Client de test, branché sur un `fetch` simulé.
 * @param over Dépendances à remplacer.
 * @returns Le client et ses doubles.
 */
function setup(over: Partial<ApiClientDeps> = {}) {
  const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();
  const vault = memoryVault(TOKEN);
  const onSessionExpired = jest.fn();
  const deps: ApiClientDeps = {
    baseUrl: { ok: true, url: "https://api.mitemo.cg" },
    fetch: fetchMock,
    vault,
    now: () => NOW,
    timeoutMs: 15_000,
    onSessionExpired,
    ...over,
  };
  return { client: createApiClient(deps), fetchMock, vault, onSessionExpired };
}

/**
 * En-têtes du n-ième appel.
 * @param fetchMock Double de `fetch`.
 * @param index Rang de l'appel.
 * @returns Les en-têtes envoyés.
 */
function headersOf(fetchMock: jest.Mock, index = 0): Record<string, string> {
  return (fetchMock.mock.calls[index]?.[1] as RequestInit).headers as Record<string, string>;
}

describe("createApiClient", () => {
  it("envoie le jeton du trousseau et valide la réponse", async () => {
    const { client, fetchMock } = setup();
    fetchMock.mockResolvedValue(reply(200, { ok: true }));

    await expect(
      client.request({ method: "GET", path: "/me", auth: true, schema: PING }),
    ).resolves.toEqual({ ok: true });

    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://api.mitemo.cg/me");
    expect(headersOf(fetchMock)["Authorization"]).toBe("Bearer jeton-1");
  });

  it("n'envoie aucun jeton sur une route publique, et une clé d'idempotence sur une écriture", async () => {
    const { client, fetchMock } = setup();
    fetchMock.mockResolvedValue(reply(200, { ok: true }));

    await client.request({
      method: "POST",
      path: "/auth/login",
      auth: false,
      body: { a: 1 },
      idempotent: true,
      schema: PING,
    });

    const headers = headersOf(fetchMock);
    expect(headers["Authorization"]).toBeUndefined();
    expect(headers[IDEMPOTENCY_KEY_HEADER]).toMatch(/^mobile-[0-9a-f-]{36}$/);
    expect(fetchMock.mock.calls[0]?.[1].body).toBe('{"a":1}');
  });

  it("renouvelle la session une seule fois sur un 401, puis rejoue la requête", async () => {
    const { client, fetchMock, vault } = setup();
    fetchMock
      .mockResolvedValueOnce(reply(401, { code: "UNAUTHENTICATED", message: "x", traceId: "t" }))
      .mockResolvedValueOnce(reply(200, RENEWED))
      .mockResolvedValueOnce(reply(200, { ok: true }));

    await expect(
      client.request({ method: "GET", path: "/me", auth: true, schema: PING }),
    ).resolves.toEqual({ ok: true });

    expect(fetchMock.mock.calls[1]?.[0]).toBe("https://api.mitemo.cg/auth/refresh");
    expect(headersOf(fetchMock, 2)["Authorization"]).toBe("Bearer jeton-2");
    expect(vault.current()).toEqual({ accessToken: "jeton-2", expiresAt: RENEWED.expiresAt });
  });

  it("partage un seul renouvellement entre des requêtes simultanées", async () => {
    const { client, fetchMock } = setup();
    fetchMock.mockImplementation((url) =>
      Promise.resolve(
        url.endsWith("/auth/refresh")
          ? reply(200, RENEWED)
          : reply(fetchMock.mock.calls.length <= 2 ? 401 : 200, { ok: true }),
      ),
    );

    await Promise.all([
      client.request({ method: "GET", path: "/me", auth: true, schema: PING }),
      client.request({ method: "GET", path: "/me", auth: true, schema: PING }),
    ]);

    expect(fetchMock.mock.calls.filter(([url]) => url.endsWith("/auth/refresh"))).toHaveLength(1);
  });

  it("efface la session et prévient l'application quand le renouvellement échoue", async () => {
    const { client, fetchMock, vault, onSessionExpired } = setup();
    fetchMock.mockResolvedValue(
      reply(401, { code: "UNAUTHENTICATED", message: "x", traceId: "t" }),
    );

    await expect(
      client.request({ method: "GET", path: "/me", auth: true, schema: PING }),
    ).rejects.toMatchObject({
      code: "UNAUTHENTICATED",
    });

    expect(vault.current()).toBeNull();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("n'envoie jamais un jeton expiré", async () => {
    const expired = { accessToken: "vieux", expiresAt: "2026-11-12T09:00:00.000Z" };
    const { client, fetchMock, onSessionExpired } = setup({ vault: memoryVault(expired) });

    await expect(
      client.request({ method: "GET", path: "/me", auth: true, schema: PING }),
    ).rejects.toBeInstanceOf(ApiClientError);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("renvoie l'erreur du contrat, et une erreur de repli pour un corps illisible", async () => {
    const { client, fetchMock } = setup();
    fetchMock.mockResolvedValueOnce(
      reply(409, { code: "CONFLICT", message: "Déjà fait", traceId: "t9" }),
    );
    await expect(
      client.request({ method: "GET", path: "/x", auth: false, schema: PING }),
    ).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      traceId: "t9",
    });

    fetchMock.mockResolvedValueOnce(reply(502));
    await expect(
      client.request({ method: "GET", path: "/x", auth: false, schema: PING }),
    ).rejects.toMatchObject({ code: "INTERNAL" });
  });

  it("refuse une réponse qui ne respecte pas le contrat", async () => {
    const { client, fetchMock } = setup();
    fetchMock.mockResolvedValue(reply(200, { ok: "oui" }));

    await expect(
      client.request({ method: "GET", path: "/x", auth: false, schema: PING }),
    ).rejects.toEqual(new ApiUnavailableError("invalid-response"));
  });

  it("n'appelle rien quand l'URL de l'API n'est pas sûre", async () => {
    const { client, fetchMock } = setup({ baseUrl: { ok: false, reason: "insecure" } });

    await expect(
      client.request({ method: "GET", path: "/x", auth: false, schema: PING }),
    ).rejects.toMatchObject({
      reason: "not-configured",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("abandonne une requête trop longue, et signale un réseau coupé", async () => {
    jest.useFakeTimers();
    const { client, fetchMock } = setup({ timeoutMs: 1_000 });
    fetchMock.mockImplementationOnce(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("abandon", "AbortError")),
          );
        }),
    );
    const pending = client.request({ method: "GET", path: "/x", auth: false, schema: PING });
    jest.advanceTimersByTime(1_000);
    await expect(pending).rejects.toMatchObject({ reason: "timeout" });
    jest.useRealTimers();

    fetchMock.mockRejectedValueOnce(new TypeError("Network request failed"));
    await expect(
      client.request({ method: "GET", path: "/x", auth: false, schema: PING }),
    ).rejects.toMatchObject({ reason: "offline" });
  });
});
