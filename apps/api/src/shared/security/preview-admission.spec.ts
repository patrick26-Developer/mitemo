import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyPreviewAdmission } from "./preview-admission.js";

const secret = "test-only-preview-key-with-32-characters";
const now = 1_794_499_200;

function grant(claims: unknown, key = secret): string {
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const signature = createHmac("sha256", key)
    .update("mitemo.preview.admission.v1." + payload)
    .digest("base64url");
  return payload + "." + signature;
}

describe("admission testeur Preview", () => {
  it("accepte uniquement une admission signée, bornée et destinée à Mitemo Preview", () => {
    expect(
      verifyPreviewAdmission(grant({ aud: "mitemo-preview", iat: now, exp: now + 3600 }), {
        secret,
        now,
      }),
    ).toBe(true);
  });

  it.each([
    { aud: "production", iat: now, exp: now + 3600 },
    { aud: "mitemo-preview", iat: now, exp: now },
    { aud: "mitemo-preview", iat: now + 60, exp: now + 3600 },
    { aud: "mitemo-preview", iat: now, exp: now + 28801 },
    { aud: "mitemo-preview", exp: now + 3600 },
  ])("refuse des droits invalides : %j", (claims) => {
    expect(verifyPreviewAdmission(grant(claims), { secret, now })).toBe(false);
  });

  it("refuse les signatures falsifiées et les messages malformés", () => {
    const claims = { aud: "mitemo-preview", iat: now, exp: now + 3600 };
    expect(verifyPreviewAdmission(grant(claims, "wrong"), { secret, now })).toBe(false);
    expect(verifyPreviewAdmission("bad", { secret, now })).toBe(false);
    expect(verifyPreviewAdmission(undefined, { secret, now })).toBe(false);
    expect(verifyPreviewAdmission(grant(claims), { secret: "short", now })).toBe(false);
  });
});
