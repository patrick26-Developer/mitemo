import type { z } from "zod";

import { createAccountApi } from "./api.wallet";
import type { ApiCall, ApiClient } from "./client.http";
import { WALLET_SUMMARY_SCHEMA } from "./schema.wallet";

/** Soldes renvoyés par l'API, en FCFA entiers. */
const SUMMARY = {
  available: { amount: "25000", currency: "XAF" },
  committed: { amount: "5000", currency: "XAF" },
  pending: { amount: "0", currency: "XAF" },
  blocked: { amount: "0", currency: "XAF" },
  simulated: true,
};

/**
 * Client qui enregistre les appels et répond par la valeur donnée.
 * @param answer Réponse.
 * @returns Le client et ses appels.
 */
function recordingClient(answer: unknown) {
  const calls: ApiCall<unknown>[] = [];
  const client: ApiClient = {
    request: <Body>(call: ApiCall<Body>) => {
      calls.push(call);
      return Promise.resolve(answer as Body);
    },
  };
  return { client, calls };
}

describe("createAccountApi", () => {
  it("lit les soldes sur une route protégée", async () => {
    const { client, calls } = recordingClient(SUMMARY);

    await expect(createAccountApi(client).walletSummary()).resolves.toEqual(SUMMARY);
    expect(calls[0]).toMatchObject({ method: "GET", path: "/wallet", auth: true });
  });

  it("enregistre le jeton de notification avec une clé d'idempotence", async () => {
    const { client, calls } = recordingClient({ registeredAt: "2026-11-12T10:00:00.000Z" });

    await createAccountApi(client).registerPushToken({
      token: "t",
      platform: "ANDROID",
      appVersion: "0.0.0",
    });

    expect(calls[0]).toMatchObject({
      path: "/notifications/push-tokens",
      auth: true,
      idempotent: true,
    });
  });
});

describe("WALLET_SUMMARY_SCHEMA", () => {
  it("refuse un montant décimal ou une devise inconnue", () => {
    const schema = WALLET_SUMMARY_SCHEMA as z.ZodType<unknown>;

    expect(schema.safeParse(SUMMARY).success).toBe(true);
    expect(
      schema.safeParse({ ...SUMMARY, available: { amount: "12.5", currency: "XAF" } }).success,
    ).toBe(false);
    expect(
      schema.safeParse({ ...SUMMARY, blocked: { amount: "1", currency: "EUR" } }).success,
    ).toBe(false);
  });
});
