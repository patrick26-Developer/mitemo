import { createHash, generateKeyPairSync, sign } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PrismaService } from "../../../shared/database/prisma.service.js";
import { SandboxCallbackController } from "./sandbox-callback.controller.js";

const path = "/integrations/pawapay/sandbox/callback";
const authority = "mitemo-api-dev.onrender.com";
const keyId = "test-key";
const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });

function signed(body: string): Record<string, string> {
  const created = Math.floor(Date.now() / 1000);
  const date = new Date(created * 1000).toISOString();
  const digest = "sha-512=:" + createHash("sha512").update(body).digest("base64") + ":";
  const params =
    '("@method" "@authority" "@path" "signature-date" "content-digest" "content-type");alg="ecdsa-p256-sha256";keyid="' +
    keyId +
    '";created=' +
    created +
    ";expires=" +
    (created + 60);
  const base = [
    '"@method": POST',
    '"@authority": ' + authority,
    '"@path": ' + path,
    '"signature-date": ' + date,
    '"content-digest": ' + digest,
    '"content-type": application/json',
    '"@signature-params": ' + params,
  ].join("\n");
  return {
    "content-type": "application/json",
    "content-digest": digest,
    "signature-date": date,
    "signature-input": "sig-pp=" + params,
    signature: "sig-pp=:" + sign("sha256", Buffer.from(base), privateKey).toString("base64") + ":",
  };
}

describe("Sandbox callback HTTP", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    vi.unstubAllEnvs();
  });

  it(
    "rejects disabled, unsigned and invalid messages and writes only normalized observations",
    { timeout: 30000 },
    async () => {
      const createMany = vi.fn().mockResolvedValue({ count: 1 });
      const module = await Test.createTestingModule({
        controllers: [SandboxCallbackController],
        providers: [
          { provide: PrismaService, useValue: { pawaPaySandboxReceipt: { createMany } } },
        ],
      }).compile();
      app = module.createNestApplication({ rawBody: true });
      await app.listen(0, "127.0.0.1");
      const client = request(app.getHttpServer());
      vi.stubEnv("PAWAPAY_SANDBOX_ENABLED", "false");
      await client.post(path).send({}).expect(404);
      vi.stubEnv("PAWAPAY_SANDBOX_ENABLED", "true");
      vi.stubEnv("MITEMO_DEPLOYMENT", "preview");
      vi.stubEnv("RENDER_SERVICE_NAME", "mitemo-api-dev");
      vi.stubEnv("PAWAPAY_SANDBOX_CALLBACK_KEY_ID", keyId);
      vi.stubEnv(
        "PAWAPAY_SANDBOX_CALLBACK_PUBLIC_KEY",
        publicKey.export({ format: "pem", type: "spki" }).toString(),
      );
      await client.post(path).send({}).expect(401);
      await client.post(path).set(signed("{}")).send("{}").expect(400);
      const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
      const body = JSON.stringify({
        depositId: id,
        amount: "500",
        status: "COMPLETED",
        country: "COG",
        currency: "XAF",
        payer: { type: "MMO", accountDetails: { provider: "MTN_MOMO_COG" } },
      });
      await client.post(path).set(signed(body)).send(body).expect(200);
      expect(createMany).toHaveBeenCalledExactlyOnceWith({
        data: { id, kind: "deposit", amount: 500n, status: "COMPLETED" },
        skipDuplicates: true,
      });
    },
  );
});
