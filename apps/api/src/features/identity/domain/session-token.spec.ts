import { describe, expect, it } from "vitest";
import { issueSessionToken, digestSessionToken } from "./session-token.js";

describe("session tokens", () => {
  it("issues distinct opaque tokens and stores only their digests", () => {
    const token = issueSessionToken();
    expect(token).toMatch(/^[\w-]{43}$/);
    expect(issueSessionToken()).not.toBe(token);
    expect(digestSessionToken(token)).toMatch(/^[0-9a-f]{64}$/);
    expect(digestSessionToken(token)).not.toContain(token);
  });
});
