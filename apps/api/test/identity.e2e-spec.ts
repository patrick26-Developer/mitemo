import { randomInt } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaService } from "../src/shared/database/prisma.service.js";
import { AppModule } from "../src/app.module.js";

const PREVIEW_KEY = "test-only-preview-key-with-32-characters";
const enabled = process.env["MITEMO_DEMO_AUTH"] === "true";

describe.runIf(enabled)("Demonstration identity", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("MITEMO_DEPLOYMENT", "preview");
    vi.stubEnv("MITEMO_PREVIEW_KEY", PREVIEW_KEY);
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.listen(0, "127.0.0.1");
  });

  afterEach(async () => {
    await app?.close();
    vi.unstubAllEnvs();
  });

  it("registers, authenticates, rotates and revokes a session", { timeout: 60_000 }, async () => {
    const publicClient = request(app.getHttpServer());
    const client = request.agent(app.getHttpServer()).set("X-Mitemo-Preview-Key", PREVIEW_KEY);
    const pin = randomInt(0, 10000).toString().padStart(4, "0");
    const phoneNumber = "+24206" + randomInt(1000000, 10000000);
    const credentials = { phoneNumber, pin };
    await client
      .post("/auth/register")
      .send({ ...credentials, displayName: "Démo Mitemo" })
      .expect(201);
    await client
      .post("/auth/register")
      .send({ ...credentials, displayName: "Doublon" })
      .expect(409);
    await client.get("/me").expect(401);
    await client
      .post("/auth/login")
      .send({ ...credentials, pin: "abc" })
      .expect(400);
    await client
      .post("/auth/login")
      .send({ ...credentials, phoneNumber: "invalid" })
      .expect(400);
    await client
      .post("/auth/register")
      .send({ ...credentials, displayName: " " })
      .expect(400);
    const challenge = await client.post("/auth/login").send(credentials).expect(200);
    const proof = { challengeId: challenge.body.challengeId, otp: challenge.body.simulatedOtp };
    const session = await client.post("/auth/verify").send(proof).expect(200);
    await client.post("/auth/verify").send(proof).expect(401);
    expect(Object.keys(session.body).sort()).toEqual(["accessToken", "expiresAt", "user"]);
    expect(Object.keys(session.body.user).sort()).toEqual([
      "displayName",
      "maskedPhoneNumber",
      "role",
      "userId",
    ]);
    const auth = "Bearer " + session.body.accessToken;
    await publicClient.get("/me").set("Authorization", auth).expect(401);
    await publicClient.post("/auth/refresh").set("Authorization", auth).expect(401);
    expect(challenge.headers["cache-control"]).toBe("no-store");
    const profile = await client.get("/me").set("Authorization", auth).expect(200);
    expect(profile.body.displayName).toBe("Démo Mitemo");
    const updated = await client
      .patch("/me")
      .set("Authorization", auth)
      .send({ displayName: "Démo Mitemo", role: "ADMIN" })
      .expect(200);
    const active = await client.get("/auth/sessions").set("Authorization", auth).expect(200);
    expect(active.body).toMatchObject([{ current: true, deviceLabel: null }]);
    expect(updated.body.role).toBe("USER");
    await client.delete("/auth/sessions/invalid").set("Authorization", auth).expect(400);
    await client
      .delete("/auth/sessions/00000000-0000-4000-8000-000000000000")
      .set("Authorization", auth)
      .expect(404);
    const rotated = await client.post("/auth/refresh").set("Authorization", auth).expect(200);
    await client.get("/me").set("Authorization", auth).expect(401);
    const current = "Bearer " + rotated.body.accessToken;
    await client.delete("/auth/session").set("Authorization", current).expect(204);
    await client.get("/me").set("Authorization", current).expect(401);
  });

  it("rejects missing and invalid preview credentials on every identity route", async () => {
    const client = request(app.getHttpServer());
    const id = "/auth/sessions/00000000-0000-4000-8000-000000000000";
    for (const route of [
      client.post("/auth/register"),
      client.post("/auth/login"),
      client.post("/auth/verify"),
      client.get("/me"),
      client.patch("/me"),
      client.post("/auth/refresh"),
      client.get("/auth/sessions"),
      client.delete(id),
      client.delete("/auth/session"),
    ])
      await route.expect(401);
    for (const route of [
      client.post("/auth/register"),
      client.post("/auth/login"),
      client.post("/auth/verify"),
      client.get("/me"),
      client.patch("/me"),
      client.post("/auth/refresh"),
      client.get("/auth/sessions"),
      client.delete(id),
      client.delete("/auth/session"),
    ]) {
      const denied = await route.set("X-Mitemo-Preview-Key", "wrong-key").expect(401);
      expect(denied.text).not.toContain(PREVIEW_KEY);
    }
  });

  it(
    "rejects expired and exhausted OTPs and accounts outside the demo",
    { timeout: 60_000 },
    async () => {
      const client = request.agent(app.getHttpServer()).set("X-Mitemo-Preview-Key", PREVIEW_KEY);
      const prisma = app.get(PrismaService);
      const phoneNumber = "+24206" + randomInt(1000000, 10000000);
      const pin = randomInt(0, 10000).toString().padStart(4, "0");
      const credentials = { phoneNumber, pin };
      await client
        .post("/auth/register")
        .send({ ...credentials, displayName: "Démo Mitemo" })
        .expect(201);
      const expired = (await client.post("/auth/login").send(credentials).expect(200)).body;
      await prisma.authChallenge.update({
        where: { id: expired.challengeId },
        data: { expiresAt: new Date(0) },
      });
      await client
        .post("/auth/verify")
        .send({ challengeId: expired.challengeId, otp: expired.simulatedOtp })
        .expect(401);

      const challenge = (await client.post("/auth/login").send(credentials).expect(200)).body;
      const incorrect = challenge.simulatedOtp === "000000" ? "000001" : "000000";
      for (let attempt = 0; attempt < 5; attempt++) {
        await client
          .post("/auth/verify")
          .send({ challengeId: challenge.challengeId, otp: incorrect })
          .expect(401);
      }
      await client
        .post("/auth/verify")
        .send({ challengeId: challenge.challengeId, otp: challenge.simulatedOtp })
        .expect(401);
      await client
        .post("/auth/login")
        .send({ ...credentials, pin: pin === "0000" ? "0001" : "0000" })
        .expect(401);
      await client.post("/auth/verify").send({ challengeId: "invalid", otp: "000000" }).expect(400);
      await client
        .post("/auth/verify")
        .send({ challengeId: challenge.challengeId, otp: "000000", deviceLabel: 42 })
        .expect(400);
      const pending = (await client.post("/auth/login").send(credentials).expect(200)).body;
      await prisma.appUser.update({ where: { phoneNumber }, data: { isDemo: false } });
      await client.post("/auth/login").send(credentials).expect(401);
      await client
        .post("/auth/verify")
        .send({ challengeId: pending.challengeId, otp: pending.simulatedOtp })
        .expect(401);
    },
  );
  it("fails closed outside preview and bounds request bursts", { timeout: 60_000 }, async () => {
    const client = request(app.getHttpServer());
    vi.stubEnv("NODE_ENV", "production");
    await client.post("/auth/login").set("X-Mitemo-Preview-Key", PREVIEW_KEY).send({}).expect(404);
    vi.stubEnv("RENDER", "true");
    vi.stubEnv("RENDER_SERVICE_NAME", "mitemo-api");
    vi.stubEnv("DATABASE_URL", "postgresql://localhost/mitemo_preview");
    await client.post("/auth/login").set("X-Mitemo-Preview-Key", PREVIEW_KEY).send({}).expect(404);
    vi.stubEnv("RENDER_SERVICE_NAME", "mitemo-api-dev");
    vi.stubEnv("DATABASE_URL", "postgresql://example.neon.tech/mitemo_preview");
    await client.post("/auth/login").set("X-Mitemo-Preview-Key", PREVIEW_KEY).send({}).expect(404);
    vi.stubEnv("DATABASE_URL", "postgresql://localhost/mitemo_preview");
    await client.post("/auth/login").set("X-Mitemo-Preview-Key", PREVIEW_KEY).send({}).expect(400);
    vi.stubEnv("RENDER", undefined);
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("MITEMO_DEPLOYMENT", undefined);
    for (let attempt = 0; attempt < 19; attempt++) {
      await client.post("/auth/login").send({}).expect(400);
    }
    await client.post("/auth/login").send({}).expect(429);
  });
});
