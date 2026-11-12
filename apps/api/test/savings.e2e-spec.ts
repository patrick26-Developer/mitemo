import { hash } from "argon2";
import { PrismaService } from "../src/shared/database/prisma.service.js";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { randomInt } from "node:crypto";
import { expect, it } from "vitest";
import { AppModule } from "../src/app.module.js";

it.runIf(process.env["MITEMO_DEMO_AUTH"] === "true")(
  "persists an owned savings plan without claiming any payments",
  async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    const app = module.createNestApplication();
    try {
      await app.listen(0, "127.0.0.1");
      const client = request(app.getHttpServer());
      const { paths } = SwaggerModule.createDocument(app, new DocumentBuilder().build());
      expect(paths["/savings/goals"]?.post?.requestBody).toBeDefined();
      expect(paths["/savings/goals"]?.get?.security).toEqual([{ bearer: [] }]);
      expect(paths["/savings/goals/{id}/calendar"]?.get?.responses["200"]).toBeDefined();
      expect(paths["/savings/goals/{id}/contributions"]?.get).toBeDefined();
      const login = async () => {
        const credentials = { phoneNumber: "+24206" + randomInt(1000000, 10000000), pin: "4936" };
        await client
          .post("/auth/register")
          .send({ ...credentials, displayName: "Épargne" })
          .expect(201);
        const { body } = await client.post("/auth/login").send(credentials).expect(200);
        const session = await client
          .post("/auth/verify")
          .send({
            challengeId: body.challengeId,
            otp: body.simulatedOtp,
          })
          .expect(200);
        return {
          authorization: "Bearer " + session.body.accessToken,
          phoneNumber: credentials.phoneNumber,
        };
      };
      const { authorization: owner, phoneNumber } = await login();
      const { authorization: other } = await login();
      const pushPath = "/notifications/push-tokens";
      const push = {
        token: "ExponentPushToken[demo-test-token]",
        platform: "ANDROID",
        appVersion: "1.0.0",
      };
      await client.post(pushPath).send(push).expect(401);
      await client
        .post(pushPath)
        .set("Authorization", owner)
        .send({ ...push, token: "bad" })
        .expect(400);
      const registered = await client
        .post(pushPath)
        .set("Authorization", owner)
        .send(push)
        .expect(200);
      await client
        .post(pushPath)
        .set("Authorization", owner)
        .send(push)
        .expect(200, registered.body);

      const body = {
        name: "Fournitures",
        terms: {
          installmentAmount: { amount: "500", currency: "XAF" },
          frequency: "MONTHLY",
          installmentsPerCycle: 3,
          cycleCount: 1,
          startsAt: "2099-01-31T00:00:00.000Z",
        },
      };
      await client.get("/savings/goals").expect(401);
      await client
        .post("/savings/goals")
        .set("Authorization", owner)
        .send({ ...body, terms: { ...body.terms, installmentsPerCycle: 0 } })
        .expect(400);
      const created = await client
        .post("/savings/goals")
        .set("Authorization", owner)
        .send(body)
        .expect(201);
      const path = "/savings/goals/" + created.body.goalId;
      await client.get(path).set("Authorization", other).expect(404);
      await client.get(path).set("Authorization", owner).expect(200, created.body);
      await client
        .get("/savings/goals")
        .set("Authorization", owner)
        .expect(200, { items: [created.body] });
      await client
        .get(path + "/contributions")
        .set("Authorization", owner)
        .expect(200, { items: [] });
      const calendar = await client
        .get(path + "/calendar")
        .set("Authorization", owner)
        .expect(200);
      expect(calendar.body.items.map((item: { dueAt: string }) => item.dueAt)).toEqual([
        "2099-01-31T00:00:00.000Z",
        "2099-02-28T00:00:00.000Z",
        "2099-03-31T00:00:00.000Z",
      ]);
      expect(
        calendar.body.items.every((item: { state: string }) => item.state === "UPCOMING"),
      ).toBe(true);
      const legacyPin = "483927";
      await app.get(PrismaService).appUser.update({
        where: { phoneNumber },
        data: { pinHash: await hash(legacyPin) },
      });
      const legacy = await client
        .post("/auth/login")
        .send({ phoneNumber, pin: legacyPin })
        .expect(200);
      await client
        .post("/auth/verify")
        .send({ challengeId: legacy.body.challengeId, otp: legacy.body.simulatedOtp })
        .expect(200);
    } finally {
      await app.close();
    }
  },
  60_000,
);
