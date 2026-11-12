import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyCallbackSignature } from "./callback-signature.js";

describe("PawaPay Sandbox signature", () => {
  it("authenticates the signed bytes and rejects changes and expiration", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
    const raw = Buffer.from('{"amount":"500","currency":"XAF"}');
    const now = 1760000000;
    const authority = "mitemo-api-dev.onrender.com";
    const path = "/integrations/pawapay/sandbox/callback";
    const params =
      '("@method" "@authority" "@path" "signature-date" "content-digest" "content-type");alg="ecdsa-p256-sha256";keyid="test-key";created=1760000000;expires=1760000060';
    const digest = "sha-256=:" + createHash("sha256").update(raw).digest("base64") + ":";
    const date = new Date((now + 10800) * 1000).toISOString();
    const base = [
      '"@method": POST',
      '"@authority": ' + authority,
      '"@path": ' + path,
      '"signature-date": ' + date,
      '"content-digest": ' + digest,
      '"content-type": application/json',
      '"@signature-params": ' + params,
    ].join("\n");
    const headers = {
      "signature-input": "sig-pp=" + params,
      signature:
        "sig-pp=:" + sign("sha256", Buffer.from(base), privateKey).toString("base64") + ":",
      "content-type": "application/json",
      "signature-date": date,
      "content-digest": digest,
    };
    const input = { raw, headers, now, authority, path, keyId: "test-key", publicKey };
    expect(verifyCallbackSignature(input)).toBe(true);
    expect(verifyCallbackSignature({ ...input, raw: Buffer.from("{}") })).toBe(false);
    expect(verifyCallbackSignature({ ...input, now: now + 61 })).toBe(false);
    expect(verifyCallbackSignature({ ...input, path: "/other" })).toBe(false);
  });
});
