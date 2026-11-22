import type { CurrentUser } from "@mitemo/contracts";
import { renderHook, waitFor } from "@testing-library/react-native";
import { identityApi } from "../../../shared/api/config.api";
import { secureSessionTokenVault } from "../../../shared/api/vault.session-token";
import { INITIAL_SESSION, useSessionStore } from "../../../shared/session/store.session";
import { useRestoreSession } from "./hook.restore-session";

jest.mock("../../../shared/api/config.api", () => ({ identityApi: { me: jest.fn() } }));
jest.mock("../../../shared/api/vault.session-token", () => ({
  secureSessionTokenVault: { load: jest.fn(), clear: jest.fn() },
}));
const USER = {
  userId: "019a6f4b-e680-7000-8000-000000000001",
  displayName: "Aimée Mbemba",
  maskedPhoneNumber: "+242*****22",
  role: "USER",
} as CurrentUser;
describe("restauration au lancement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-12T15:00:00Z"));
    useSessionStore.setState(INITIAL_SESSION);
  });
  afterEach(() => jest.useRealTimers());
  it("attend la confirmation de /me avant de rendre le compte accessible", async () => {
    jest
      .mocked(secureSessionTokenVault.load)
      .mockResolvedValue({ accessToken: "opaque", expiresAt: "2026-11-12T16:00:00Z" });
    jest.mocked(identityApi.me).mockResolvedValue(USER);
    const { result } = await renderHook(useRestoreSession);
    await waitFor(() => expect(result.current).toBe(true));
    expect(useSessionStore.getState().user).toEqual(USER);
    expect(useSessionStore.getState().signedIn).toBe(true);
  });
  it("rend la connexion accessible hors ligne sans inventer de session", async () => {
    jest
      .mocked(secureSessionTokenVault.load)
      .mockResolvedValue({ accessToken: "opaque", expiresAt: "2026-11-12T16:00:00Z" });
    jest.mocked(identityApi.me).mockRejectedValue(new Error("offline"));
    const { result } = await renderHook(useRestoreSession);
    await waitFor(() => expect(result.current).toBe(true));
    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(secureSessionTokenVault.clear).not.toHaveBeenCalled();
  });
});
