import * as SecureStore from "expo-secure-store";
import { withPreviewAdmission } from "./fetch.preview-admission";

jest.mock("expo-secure-store", () => ({ getItemAsync: jest.fn() }));
const origin = { ok: true as const, url: "https://mitemo-api-dev.onrender.com" };

describe("admission mobile", () => {
  beforeEach(() => jest.clearAllMocks());
  it("envoie le laissez-passer saisi seulement à une route de connexion de l'API", async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue("signed-admission");
    const fetch = jest.fn().mockResolvedValue({ status: 200 });
    await withPreviewAdmission(fetch, origin)(origin.url + "/auth/login", { method: "POST" });
    const headers = new Headers(fetch.mock.calls[0]?.[1].headers);
    expect(headers.get("x-mitemo-preview-admission")).toBe("signed-admission");
    expect(headers.has("x-mitemo-preview-key")).toBe(false);
  });
  it("conserve le Bearer et ne joint pas l'admission aux lectures privées", async () => {
    const fetch = jest.fn().mockResolvedValue({ status: 200 });
    await withPreviewAdmission(fetch, origin)(origin.url + "/wallet", {
      headers: { Authorization: "Bearer session" },
    });
    expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
    expect(new Headers(fetch.mock.calls[0]?.[1].headers).get("Authorization")).toBe(
      "Bearer session",
    );
  });
  it("n'envoie pas le laissez-passer vers une autre origine", async () => {
    const fetch = jest.fn().mockResolvedValue({ status: 200 });
    await withPreviewAdmission(fetch, origin)("https://example.org/auth/login", {});
    expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
  });
});
