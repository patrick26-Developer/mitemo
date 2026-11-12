import { startServerAuth } from "./model.server-auth";

const challenge = {
  challengeId: "challenge",
  expiresAt: "2026-11-13T09:00:00.000Z",
  simulatedOtp: "123456",
};
const draft = { mode: "sign-up" as const, phone: "+242065706622", name: "Membre test" };

describe("authentification serveur", () => {
  it("inscrit avant de demander un défi et ne vérifie jamais automatiquement l'OTP", async () => {
    const api = {
      register: jest.fn().mockResolvedValue({}),
      startLogin: jest.fn().mockResolvedValue(challenge),
    };
    await expect(startServerAuth({ draft, pin: "4821", api })).resolves.toEqual(challenge);
    expect(api.register).toHaveBeenCalledWith({
      phoneNumber: draft.phone,
      pin: "4821",
      displayName: draft.name,
    });
    expect(api.startLogin).toHaveBeenCalledWith({ phoneNumber: draft.phone, pin: "4821" });
  });

  it("ne réinscrit pas un membre à la connexion", async () => {
    const api = { register: jest.fn(), startLogin: jest.fn().mockResolvedValue(challenge) };
    await startServerAuth({ draft: { ...draft, mode: "sign-in" }, pin: "482100", api });
    expect(api.register).not.toHaveBeenCalled();
    expect(api.startLogin).toHaveBeenCalledWith({ phoneNumber: draft.phone, pin: "482100" });
  });

  it("ne transforme pas un échec réseau en ouverture de session", async () => {
    const api = {
      register: jest.fn().mockRejectedValue(new Error("offline")),
      startLogin: jest.fn(),
    };
    await expect(startServerAuth({ draft, pin: "4821", api })).rejects.toThrow("offline");
    expect(api.startLogin).not.toHaveBeenCalled();
  });
});
