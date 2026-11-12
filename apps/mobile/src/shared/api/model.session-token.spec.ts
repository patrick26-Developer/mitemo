import { isTokenUsable, sessionTokenOf } from "./model.session-token";

/** Instant de référence des tests, en UTC. */
const NOW = Date.parse("2026-11-12T10:00:00.000Z");

describe("isTokenUsable", () => {
  it("garde un jeton qui expire dans plus de 30 secondes", () => {
    expect(isTokenUsable({ accessToken: "a", expiresAt: "2026-11-12T10:05:00.000Z" }, NOW)).toBe(
      true,
    );
  });

  it("écarte un jeton expiré ou sur le point de l'être", () => {
    expect(isTokenUsable({ accessToken: "a", expiresAt: "2026-11-12T10:00:20.000Z" }, NOW)).toBe(
      false,
    );
    expect(isTokenUsable({ accessToken: "a", expiresAt: "2026-11-12T09:00:00.000Z" }, NOW)).toBe(
      false,
    );
  });
});

describe("sessionTokenOf", () => {
  it("ne garde de la session que le jeton et son expiration", () => {
    const session = {
      accessToken: "jeton",
      expiresAt: "2026-11-12T11:00:00.000Z",
      user: { userId: "u1", displayName: "Aimée", maskedPhoneNumber: "06*****22", role: "USER" },
    } as const;

    expect(sessionTokenOf(session)).toEqual({
      accessToken: "jeton",
      expiresAt: "2026-11-12T11:00:00.000Z",
    });
  });
});
