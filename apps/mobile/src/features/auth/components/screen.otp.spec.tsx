import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { identityApi } from "../../../shared/api/config.api";
import { useSessionStore, INITIAL_SESSION } from "../../../shared/session/store.session";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { useServerChallenge } from "../model/store.server-challenge";
import { OtpScreen } from "./screen.otp";

jest.mock("../../../shared/api/config.api", () => ({ identityApi: { verifyLogin: jest.fn() } }));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

describe("OTP serveur", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSessionStore.setState(INITIAL_SESSION);
    useServerChallenge.getState().setChallenge({
      challengeId: "challenge",
      expiresAt: "2026-11-13T09:00:00Z",
      simulatedOtp: "123456",
    } as never);
  });
  it("n'ouvre pas la session avant une saisie et une réponse serveur validée", async () => {
    jest
      .mocked(identityApi.verifyLogin)
      .mockResolvedValue({ user: { userId: "user", displayName: "Membre" } } as never);
    await renderWithSafeArea(<OtpScreen />);
    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(identityApi.verifyLogin).not.toHaveBeenCalled();
    await fireEvent.changeText(screen.getByLabelText("Code OTP à 6 chiffres"), "123456");
    await fireEvent.press(screen.getByRole("button", { name: "Vérifier le code" }));
    await waitFor(() => expect(useSessionStore.getState().signedIn).toBe(true));
    expect(identityApi.verifyLogin).toHaveBeenCalledWith({
      challengeId: "challenge",
      otp: "123456",
    });
  });
  it("reste déconnecté après un OTP refusé", async () => {
    jest.mocked(identityApi.verifyLogin).mockRejectedValue(new Error("401"));
    await renderWithSafeArea(<OtpScreen />);
    await fireEvent.changeText(screen.getByLabelText("Code OTP à 6 chiffres"), "654321");
    await fireEvent.press(screen.getByRole("button", { name: "Vérifier le code" }));
    expect(await screen.findByText(/Code refusé/)).toBeOnTheScreen();
    expect(useSessionStore.getState().signedIn).toBe(false);
  });
});
