import { IDEMPOTENCY_KEY_HEADER } from "@mitemo/contracts";

import { apiClient, ApiClientError, apiRequest } from "./client.http";

const fetchMock = jest.fn();

/** URL de base attendue, vide quand Expo ne la fixe pas à la compilation. */
const BASE_URL = process.env["EXPO_PUBLIC_API_URL"] ?? "";

/**
 * Construit une réponse HTTP minimale, avec un corps JSON lisible.
 * @param payload Corps renvoyé.
 * @param status Statut HTTP.
 * @returns La réponse simulée.
 */
function makeResponse(payload: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(payload),
  } as unknown as Response;
}

/**
 * Construit une réponse en échec dont le corps n'est pas du JSON.
 * @returns La réponse simulée.
 */
function makeUnreadableResponse(): Response {
  return {
    ok: false,
    status: 502,
    json: () => Promise.reject(new Error("corps illisible")),
  } as unknown as Response;
}

/**
 * Renvoie le dernier appel `fetch` enregistré, avec ses types.
 * @returns L'URL appelée et l'initialisation de la requête.
 */
function lastCall(): { url: string; init: RequestInit } {
  const call = fetchMock.mock.calls.at(-1) as readonly [string, RequestInit?] | undefined;
  if (call === undefined) throw new Error("Aucun appel fetch enregistré.");

  const [url, init = {}] = call;
  return { url, init };
}

describe("apiRequest", () => {
  const originalFetch = globalThis.fetch;

  beforeAll(() => {
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("renvoie le corps désérialisé d'une réponse réussie", async () => {
    fetchMock.mockResolvedValue(makeResponse({ registeredAt: "2026-01-01T00:00:00.000Z" }));

    const body = await apiRequest<{ registeredAt: string }>({ method: "GET", path: "/health" });

    expect(body.registeredAt).toBe("2026-01-01T00:00:00.000Z");
    const { url, init } = lastCall();
    expect(url).toBe(`${BASE_URL}/health`);
    expect(init.method).toBe("GET");
    expect(init.body).toBeUndefined();
  });

  it("envoie le corps JSON et la clé d'idempotence fournis", async () => {
    fetchMock.mockResolvedValue(makeResponse({}));

    await apiRequest({
      method: "POST",
      path: "/tontines",
      body: { name: "Marché" },
      idempotencyKey: "cle-1",
    });

    const { init } = lastCall();
    expect(init.body).toBe(JSON.stringify({ name: "Marché" }));
    expect(init.headers).toMatchObject({ [IDEMPOTENCY_KEY_HEADER]: "cle-1" });
  });

  it("lève une ApiClientError porteuse du corps d'erreur du contrat", async () => {
    fetchMock.mockResolvedValue(
      makeResponse(
        {
          code: "CONFLICT",
          message: "Déjà inscrit.",
          traceId: "trace-9",
          fields: [{ field: "phone", reason: "déjà pris" }],
        },
        409,
      ),
    );

    const failure = apiRequest({ method: "POST", path: "/members" });

    await expect(failure).rejects.toBeInstanceOf(ApiClientError);
    await expect(failure).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      traceId: "trace-9",
      message: "Déjà inscrit.",
      fields: [{ field: "phone", reason: "déjà pris" }],
    });
  });

  it("retombe sur un corps d'erreur générique quand le format est inconnu", async () => {
    fetchMock.mockResolvedValue(makeResponse({ code: 42 }, 500));

    await expect(apiRequest({ method: "GET", path: "/health" })).rejects.toMatchObject({
      status: 500,
      code: "INTERNAL",
      traceId: "inconnu",
      fields: [],
    });
  });

  it("retombe sur un corps d'erreur générique quand le corps est illisible", async () => {
    fetchMock.mockResolvedValue(makeUnreadableResponse());

    await expect(apiRequest({ method: "GET", path: "/health" })).rejects.toMatchObject({
      status: 502,
      code: "INTERNAL",
    });
  });
});

describe("apiClient", () => {
  const originalFetch = globalThis.fetch;

  beforeAll(() => {
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("enregistre le jeton de notification avec une clé d'idempotence", async () => {
    fetchMock.mockResolvedValue(makeResponse({ registeredAt: "2026-01-01T00:00:00.000Z" }));
    const payload = {
      token: "ExponentPushToken[abc]",
      platform: "ANDROID" as const,
      appVersion: "1.0.0",
    };

    const body = await apiClient.registerPushToken(payload);

    expect(body.registeredAt).toBe("2026-01-01T00:00:00.000Z");
    const { url, init } = lastCall();
    expect(url).toBe(`${BASE_URL}/notifications/push-tokens`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual(payload);
    const headers = init.headers as Record<string, string>;
    expect(headers[IDEMPOTENCY_KEY_HEADER]).toMatch(/^mobile-[0-9a-f-]{36}$/);
  });

  it("tire une nouvelle clé d'idempotence à chaque appel", async () => {
    fetchMock.mockResolvedValue(makeResponse({ registeredAt: "2026-01-01T00:00:00.000Z" }));
    const payload = {
      token: "ExponentPushToken[abc]",
      platform: "IOS" as const,
      appVersion: "1.0.0",
    };

    await apiClient.registerPushToken(payload);
    const firstHeaders = lastCall().init.headers as Record<string, string>;
    await apiClient.registerPushToken(payload);
    const secondHeaders = lastCall().init.headers as Record<string, string>;

    expect(firstHeaders[IDEMPOTENCY_KEY_HEADER]).not.toBe(secondHeaders[IDEMPOTENCY_KEY_HEADER]);
  });
});
