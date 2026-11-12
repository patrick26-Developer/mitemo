import { parseApiBaseUrl } from "./model.api-base-url";

/** En production : HTTPS seulement. */
const PROD = { allowLocalHttp: false };

/** En développement : HTTP toléré vers la machine locale ou le réseau local. */
const DEV = { allowLocalHttp: true };

describe("parseApiBaseUrl", () => {
  it("accepte une URL HTTPS et retire la barre finale", () => {
    expect(parseApiBaseUrl("https://api.mitemo.cg/", PROD)).toEqual({
      ok: true,
      url: "https://api.mitemo.cg",
    });
  });

  it("refuse HTTP en production, même vers la machine locale", () => {
    expect(parseApiBaseUrl("http://localhost:3000", PROD)).toEqual({
      ok: false,
      reason: "insecure",
    });
  });

  it("tolère HTTP en développement vers la machine, l'émulateur ou le réseau local", () => {
    for (const raw of [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://10.0.2.2:3000",
      "http://192.168.1.20:3000",
    ]) {
      expect(parseApiBaseUrl(raw, DEV)).toMatchObject({ ok: true });
    }
  });

  it("refuse HTTP vers un hôte public, même en développement", () => {
    expect(parseApiBaseUrl("http://api.mitemo.cg", DEV)).toEqual({ ok: false, reason: "insecure" });
  });

  it("refuse une URL absente, invalide ou porteuse d'identifiants", () => {
    expect(parseApiBaseUrl(undefined, PROD)).toEqual({ ok: false, reason: "missing" });
    expect(parseApiBaseUrl("pas une url", PROD)).toEqual({ ok: false, reason: "invalid" });
    expect(parseApiBaseUrl("https://user:secret@api.mitemo.cg", PROD)).toEqual({
      ok: false,
      reason: "invalid",
    });
    expect(parseApiBaseUrl("https://api.mitemo.cg?cle=1", PROD)).toEqual({
      ok: false,
      reason: "invalid",
    });
  });
});
