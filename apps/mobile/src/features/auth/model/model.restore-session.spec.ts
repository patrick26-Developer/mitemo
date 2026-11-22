import { restoreServerSession } from "./model.restore-session";

describe("reprise de session", () => {
  const token = { accessToken: "opaque", expiresAt: "2026-11-13T08:00:00.000Z" };
  const now = Date.parse("2026-11-12T15:00:00Z");
  it("ne rétablit rien sans jeton conservé", async () => {
    const me = jest.fn();
    expect(
      await restoreServerSession({ vault: { load: async () => null, clear: jest.fn() }, me, now }),
    ).toBeNull();
    expect(me).not.toHaveBeenCalled();
  });
  it("demande au serveur de valider le jeton avant d'ouvrir les données", async () => {
    const user = { userId: "user", displayName: "Membre" };
    const me = jest.fn().mockResolvedValue(user);
    expect(
      await restoreServerSession({ vault: { load: async () => token, clear: jest.fn() }, me, now }),
    ).toEqual(user);
    expect(me).toHaveBeenCalledTimes(1);
  });
  it("efface un jeton expiré sans envoyer de requête", async () => {
    const clear = jest.fn();
    const me = jest.fn();
    await restoreServerSession({
      vault: { load: async () => token, clear },
      me,
      now: Date.parse(token.expiresAt),
    });
    expect(clear).toHaveBeenCalled();
    expect(me).not.toHaveBeenCalled();
  });
  it("ne fabrique pas de profil hors ligne et conserve le jeton pour un nouvel essai", async () => {
    const clear = jest.fn();
    const me = jest.fn().mockRejectedValue(new Error("offline"));
    await expect(
      restoreServerSession({ vault: { load: async () => token, clear }, me, now }),
    ).rejects.toThrow("offline");
    expect(clear).not.toHaveBeenCalled();
  });
});
