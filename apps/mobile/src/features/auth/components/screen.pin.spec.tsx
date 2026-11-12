import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { identityApi } from "../../../shared/api/config.api";
import { ApiClientError, UNAUTHENTICATED_BODY } from "../../../shared/api/error.api";
import { INITIAL_SESSION, useSessionStore } from "../../../shared/session/store.session";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { PIN_UNAVAILABLE_MESSAGE } from "../hooks/hook.pin-validation";
import { INITIAL_AUTH_DRAFT, useAuthDraft } from "../model/model.auth-draft";
import { useServerChallenge } from "../model/store.server-challenge";
import { PinScreen } from "./screen.pin";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));
jest.mock("../../../shared/api/config.api", () => ({
  identityApi: { register: jest.fn(), startLogin: jest.fn() },
}));

const PHONE = "+242 06 570 6622";
const CHALLENGE = {
  challengeId: "challenge",
  expiresAt: "2026-11-13T09:00:00.000Z",
  simulatedOtp: "123456",
};

async function enterPin(digits: string): Promise<void> {
  for (const digit of digits) await fireEvent.press(screen.getByRole("button", { name: digit }));
}

describe("PinScreen connecté", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(identityApi.startLogin).mockResolvedValue(CHALLENGE as never);
    jest.mocked(identityApi.register).mockResolvedValue({} as never);
    useAuthDraft.setState(INITIAL_AUTH_DRAFT);
    useServerChallenge.getState().setChallenge(null);
    useSessionStore.setState(INITIAL_SESSION);
  });
  it("affiche quatre cases et le clavier", async () => {
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);
    expect(screen.getByText("Code PIN")).toBeOnTheScreen();
    for (const index of [0, 1, 2, 3])
      expect(screen.getByTestId(`pin-box-${index}`)).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Effacer" })).toBeOnTheScreen();
  });
  it("passe à l'OTP sans ouvrir de session après le PIN", async () => {
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);
    await enterPin("4821");
    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/(auth)/otp"));
    expect(identityApi.startLogin).toHaveBeenCalledWith({ phoneNumber: PHONE, pin: "4821" });
    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(useServerChallenge.getState().challenge).toEqual(CHALLENGE);
    expect(useAuthDraft.getState().phone).toBe(PHONE);
  });
  it("efface le code et signale un PIN refusé par le serveur", async () => {
    jest
      .mocked(identityApi.startLogin)
      .mockRejectedValue(new ApiClientError(401, UNAUTHENTICATED_BODY));
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);
    await enterPin("0000");
    expect(await screen.findByText(/Code incorrect/)).toBeOnTheScreen();
    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(screen.getByTestId("pin-box-0")).not.toHaveTextContent("•");
  });
  it("ne transforme pas un échec réseau en session locale", async () => {
    jest.mocked(identityApi.startLogin).mockRejectedValue(new Error("offline"));
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);
    await enterPin("4821");
    expect(await screen.findByText(PIN_UNAVAILABLE_MESSAGE)).toBeOnTheScreen();
    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(router.push).not.toHaveBeenCalledWith("/(auth)/otp");
  });
  it("inscrit le compte sur le serveur avant de demander l'OTP", async () => {
    useAuthDraft
      .getState()
      .startSignUp({ firstName: "Aimée", lastName: "Mbemba", occupation: "Commerçante" }, PHONE);
    await renderWithSafeArea(<PinScreen />);
    expect(
      screen.getByRole("progressbar", { name: "Étape 2 sur 2 : Votre code PIN" }),
    ).toBeOnTheScreen();
    await enterPin("4821");
    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/(auth)/otp"));
    expect(identityApi.register).toHaveBeenCalledWith({
      phoneNumber: PHONE,
      pin: "4821",
      displayName: "Aimée Mbemba",
    });
    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(useAuthDraft.getState().mode).toBe("sign-in");
    expect(router.replace).not.toHaveBeenCalledWith("/(auth)/sign-in");
  });
  it("revient à la connexion sans brouillon", async () => {
    await renderWithSafeArea(<PinScreen />);
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/(auth)/sign-in"));
  });
  it("conserve la feuille de code oublié sans prétendre envoyer un SMS", async () => {
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Code PIN oublié" }));
    expect(screen.getByRole("header", { name: "Code PIN oublié" })).toBeOnTheScreen();
  });
});
