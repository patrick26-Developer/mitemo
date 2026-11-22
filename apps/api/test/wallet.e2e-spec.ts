import { randomInt, randomUUID } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module.js";
import { PrismaService } from "../src/shared/database/prisma.service.js";

const KEY = "test-only-wallet-preview-key-000000";
const enabled = process.env["MITEMO_DEMO_AUTH"] === "true";

describe.runIf(enabled)("Wallet demonstration", () => {
  let app: INestApplication;

  beforeAll(async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("MITEMO_DEPLOYMENT", "preview");
    vi.stubEnv("MITEMO_PREVIEW_KEY", KEY);
    app = await startApi();
  });

  afterAll(async () => {
    await app?.close();
    vi.unstubAllEnvs();
  });

  async function startApi(): Promise<INestApplication> {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    const instance = module.createNestApplication();
    await instance.listen(0, "127.0.0.1");
    return instance;
  }

  async function login() {
    const client = request.agent(app.getHttpServer()).set("X-Mitemo-Preview-Key", KEY);
    const credentials = { phoneNumber: "+24206" + randomInt(1000000, 10000000), pin: "4936" };
    await client
      .post("/auth/register")
      .send({ ...credentials, displayName: "Démo portefeuille" })
      .expect(201);
    const { body: challenge } = await client.post("/auth/login").send(credentials).expect(200);
    const { body: session } = await client
      .post("/auth/verify")
      .send({ challengeId: challenge.challengeId, otp: challenge.simulatedOtp })
      .expect(200);
    const authorization = "Bearer " + session.accessToken;
    return { client: client.set("Authorization", authorization), authorization };
  }

  it(
    "records a balanced credit once per key and isolates history",
    { timeout: 60_000 },
    async () => {
      const { client, authorization } = await login();
      const { client: another } = await login();
      await request(app.getHttpServer())
        .get("/wallet")
        .set("Authorization", authorization)
        .expect(200);
      await client.get("/wallet/movements").query({ limit: 0 }).expect(400);
      await client.post("/wallet/demo-funding").send({}).expect(400);
      await client
        .post("/wallet/demo-funding")
        .set("Idempotency-Key", randomUUID())
        .send({ amount: { amount: "5001", currency: "XAF" } })
        .expect(400);
      const key = randomUUID();
      const fund = () =>
        client
          .post("/wallet/demo-funding")
          .set("Idempotency-Key", key)
          .send({ amount: { amount: "5000", currency: "XAF" } })
          .expect(200);
      await client
        .get("/wallet")
        .expect(200)
        .expect(({ body }) => expect(body.available.amount).toBe("0"));
      const [first, replay] = await Promise.all([fund(), fund()]);
      expect(first.body).toEqual(replay.body);
      expect(first.body.state).toBe("CONFIRMED");
      const ledger = app.get(PrismaService);
      const lines = await ledger.ledgerPostingLine.findMany({
        where: { entryId: first.body.transactionId },
      });
      expect(lines.map(({ amount }) => amount).sort()).toEqual([-5000n, 5000n]);
      await client
        .get("/wallet")
        .expect(200)
        .expect(({ body }) => expect(body.available.amount).toBe("5000"));
      const { body: history } = await client.get("/wallet/movements").expect(200);
      expect(history.items).toMatchObject([
        { amount: { amount: "5000", currency: "XAF" }, simulated: true },
      ]);
      await client
        .post("/wallet/demo-funding")
        .set("Idempotency-Key", randomUUID())
        .send({ amount: { amount: "5000", currency: "XAF" } })
        .expect(200);
      const { body: page } = await client.get("/wallet/movements").query({ limit: 1 }).expect(200);
      expect(page.items).toHaveLength(1);
      const { body: next } = await client
        .get("/wallet/movements")
        .query({ limit: 1, cursor: page.nextCursor })
        .expect(200);
      expect(next.items).toHaveLength(1);
      expect(next.items[0].movementId).not.toBe(page.items[0].movementId);
      expect(next.nextCursor).toBeUndefined();
      await another.get("/wallet/movements").expect(200, { items: [] });
      await another
        .get("/wallet/movements")
        .query({ cursor: first.body.transactionId })
        .expect(400);
      await app.close();
      app = await startApi();
      const persisted = await request(app.getHttpServer())
        .get("/wallet")
        .set("Authorization", authorization)
        .set("X-Mitemo-Preview-Key", KEY)
        .expect(200);
      expect(persisted.body.available.amount).toBe("10000");
      vi.stubEnv("MITEMO_DEPLOYMENT", undefined);
      await request(app.getHttpServer())
        .post("/wallet/demo-funding")
        .set("Authorization", authorization)
        .set("Idempotency-Key", randomUUID())
        .send({ amount: { amount: "5000", currency: "XAF" } })
        .expect(404);
    },
  );
});
