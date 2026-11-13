import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, it } from "vitest";

import { AppModule } from "../src/app.module.js";

describe("GET /support/contact", () => {
  let app: INestApplication;
  const original = process.env["SUPPORT_PHONE"];

  beforeAll(async () => {
    process.env["SUPPORT_PHONE"] = "+242 06 570 6622";
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (original === undefined) delete process.env["SUPPORT_PHONE"];
    else process.env["SUPPORT_PHONE"] = original;
  });

  it("donne le numéro du service client, sans session, avec sa durée de vie", async () => {
    await request(app.getHttpServer())
      .get("/support/contact")
      .expect(200, { phoneNumber: "+242065706622", maxAgeSeconds: 86_400 });
  });
});
