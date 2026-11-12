import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { USER_ROLES } from "./auth.ts";
import type {
  SessionResponse,
  StartLoginRequest,
  StartLoginResponse,
  UserRole,
  VerifyLoginRequest,
} from "./auth.ts";
import { toIsoDateTime } from "./datetime.ts";
import type { LoginChallengeId, UserId } from "./identifiers.ts";

describe("UserRole", () => {
  it("ne connaît que les deux rôles de la démonstration", () => {
    assert.deepEqual(USER_ROLES, ["USER", "ADMIN"]);
  });

  it("refuse un rôle inconnu", () => {
    // @ts-expect-error "SUPPORT" n'est pas un rôle de la démonstration
    const role: UserRole = "SUPPORT";

    assert.equal(typeof role, "string");
  });
});

describe("connexion en deux étapes", () => {
  it("vérifie d'abord le numéro et le PIN, puis l'OTP simulé", () => {
    const start: StartLoginRequest = { phoneNumber: "+242061234567", pin: "1234" };
    const challenge: StartLoginResponse = {
      challengeId: "c1" as LoginChallengeId,
      expiresAt: toIsoDateTime("2026-11-07T08:05:00.000Z"),
      simulatedOtp: "482913",
    };
    const verify: VerifyLoginRequest = { challengeId: challenge.challengeId, otp: "482913" };

    assert.equal(start.pin.length, 4);
    assert.equal(verify.challengeId, challenge.challengeId);
  });

  it("ouvre une session qui porte le rôle appliqué par l'API", () => {
    const session: SessionResponse = {
      accessToken: "jeton-opaque",
      expiresAt: toIsoDateTime("2026-11-07T20:00:00.000Z"),
      user: {
        userId: "u1" as UserId,
        displayName: "Grâce",
        maskedPhoneNumber: "06*****67",
        role: "USER",
      },
    };

    assert.equal(session.user.role, "USER");
  });
});
