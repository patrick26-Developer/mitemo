import assert from "node:assert/strict";
import { test } from "node:test";
import { issuePreviewAdmission } from "./issue-preview-admission.mjs";

test("le laissez-passer contient des droits bornés et jamais la clé serveur", () => {
  const secret = "test-only-preview-key-with-32-characters";
  const token = issuePreviewAdmission({ secret, now: 1000, ttlSeconds: 3600 });
  const payload = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString());
  assert.deepEqual(payload, { aud: "mitemo-preview", iat: 1000, exp: 4600 });
  assert.equal(token.includes(secret), false);
});

test("les clés courtes et durées excessives sont refusées", () => {
  assert.throws(() => issuePreviewAdmission({ secret: "short", now: 1000, ttlSeconds: 60 }));
  assert.throws(() =>
    issuePreviewAdmission({ secret: "x".repeat(32), now: 1000, ttlSeconds: 28801 }),
  );
});
