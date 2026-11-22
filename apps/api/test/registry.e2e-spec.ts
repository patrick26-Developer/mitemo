import { randomInt, randomUUID } from "node:crypto";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module.js";

describe("Registre HTTP gratuit", () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app?.close();
  });
  async function account() {
    const credentials = { phoneNumber: "+24206" + randomInt(1000000, 10000000), pin: "4936" };
    const user = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ ...credentials, displayName: "Démo registre" })
      .expect(201);
    const challenge = await request(app.getHttpServer())
      .post("/auth/login")
      .send(credentials)
      .expect(200);
    const session = await request(app.getHttpServer())
      .post("/auth/verify")
      .send({ challengeId: challenge.body.challengeId, otp: challenge.body.simulatedOtp })
      .expect(200);
    return { userId: user.body.userId, token: session.body.accessToken as string };
  }
  it("A invite B, B accepte et relit un groupe gratuit sans mouvement financier", async () => {
    const a = await account(),
      b = await account(),
      c = await account();
    const client = (token: string) =>
      request.agent(app.getHttpServer()).set("Authorization", "Bearer " + token);
    const ca = client(a.token),
      cb = client(b.token),
      cc = client(c.token);
    await request(app.getHttpServer()).get("/registry/tontines").expect(401);
    const key = randomUUID(),
      body = {
        name: "Marché solidaire",
        contributionAmount: { amount: "2000", currency: "XAF" },
        participantCount: 2,
        frequency: { unit: "semaine", interval: 1 },
      };
    const group = await ca
      .post("/registry/tontines")
      .set("Idempotency-Key", key)
      .send(body)
      .expect(201);
    expect(group.body.mode).toBe("REGISTRY");
    expect(group.body.feePolicy.mitemoFee).toBe("0");
    const replay = await ca
      .post("/registry/tontines")
      .set("Idempotency-Key", key)
      .send(body)
      .expect(201);
    expect(replay.body.id).toBe(group.body.id);
    await cb
      .patch("/registry/tontines/" + group.body.id)
      .send({ name: "Interdit" })
      .expect(404);
    await ca
      .patch("/registry/tontines/" + group.body.id)
      .send({ name: "Marché confirmé" })
      .expect(200);
    await ca.post("/registry/tontines").set("Idempotency-Key", key).send(body).expect(201);
    await ca
      .post("/registry/tontines")
      .set("Idempotency-Key", key)
      .send({ ...body, name: "Autre demande" })
      .expect(400);
    await cc.get("/registry/tontines/" + group.body.id).expect(404);
    const invitation = await ca
      .post("/registry/tontines/" + group.body.id + "/invitations")
      .send({ userId: b.userId })
      .expect(201);
    const inbox = await cb.get("/registry/invitations").expect(200);
    expect(inbox.body.some((item: { id: string }) => item.id === invitation.body.id)).toBe(true);
    await cc.get("/registry/invitations").expect(200, []);
    await cc
      .post("/registry/invitations/" + invitation.body.id + "/accept")
      .send({ acceptedPolicyVersion: "registry-free-v1" })
      .expect(404);
    await cb
      .post("/registry/invitations/" + invitation.body.id + "/accept")
      .send({ acceptedPolicyVersion: "registry-free-v1" })
      .expect(201);
    await cb
      .post("/registry/invitations/" + invitation.body.id + "/accept")
      .send({ acceptedPolicyVersion: "registry-free-v1" })
      .expect(201);
    const members = await cb.get("/registry/tontines/" + group.body.id + "/members").expect(200);
    expect(members.body).toHaveLength(2);
    await cb.get("/wallet/movements").expect(200, { items: [] });
    await cb.delete("/auth/session").expect(204);
  }, 60000);
});
