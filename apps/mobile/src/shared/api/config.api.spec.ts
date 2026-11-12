import type * as ConfigModule from "./config.api";
import { ApiUnavailableError } from "./error.api";

jest.mock("expo-secure-store", () => ({
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

/**
 * Charge la configuration avec l'URL donnée.
 * @param url Valeur de `EXPO_PUBLIC_API_URL`.
 * @returns Le module de configuration.
 */
function loadWith(url: string | undefined): typeof ConfigModule {
  if (url === undefined) delete process.env["EXPO_PUBLIC_API_URL"];
  else process.env["EXPO_PUBLIC_API_URL"] = url;
  let loaded: typeof ConfigModule | undefined;
  jest.isolateModules(() => {
    loaded = jest.requireActual<typeof ConfigModule>("./config.api");
  });
  if (loaded === undefined) throw new Error("Configuration non chargée.");
  return loaded;
}

describe("configuration de l'API", () => {
  const original = process.env["EXPO_PUBLIC_API_URL"];
  afterEach(() => {
    if (original === undefined) delete process.env["EXPO_PUBLIC_API_URL"];
    else process.env["EXPO_PUBLIC_API_URL"] = original;
  });

  it("n'appelle rien sans URL configurée", async () => {
    const config = loadWith(undefined);

    expect(config.API_BASE_URL).toEqual({ ok: false, reason: "missing" });
    await expect(
      config.identityApi.startLogin({ phoneNumber: "+242065706622", pin: "482100" }),
    ).rejects.toEqual(new ApiUnavailableError("not-configured"));
  });

  it("refuse une URL HTTP vers un hôte public", () => {
    expect(loadWith("http://api.mitemo.cg").API_BASE_URL).toEqual({
      ok: false,
      reason: "insecure",
    });
  });

  it("accepte l'URL HTTPS de l'API", () => {
    expect(loadWith("https://api.mitemo.cg").API_BASE_URL).toEqual({
      ok: true,
      url: "https://api.mitemo.cg",
    });
  });
});
