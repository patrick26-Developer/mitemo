import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { NO_ACCOUNT_ERROR, VAULT_ERROR } from "../hooks/hook.sign-in-form";
import { INITIAL_AUTH_DRAFT, useAuthDraft } from "../model/model.auth-draft";
import { registerPin } from "../model/model.pin-auth";
import { createMemoryPinAuth } from "../testing/mock.pin-auth";
import { SignInScreen } from "./screen.sign-in";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));

/** Trousseau en mémoire, partagé avec le module simulé. */
const mockPinAuth = createMemoryPinAuth();

jest.mock("../api/deps.pin-auth", () => ({
  get PIN_AUTH_DEPS() {
    return mockPinAuth.deps;
  },
}));

const PHONE = "+242 06 570 6622";

describe("SignInScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPinAuth.reset();
    useAuthDraft.setState(INITIAL_AUTH_DRAFT);
  });

  it("affiche la saisie du numéro", async () => {
    await renderWithSafeArea(<SignInScreen />);

    expect(screen.getByText("Bon retour !")).toBeOnTheScreen();
    expect(screen.getByText("+242")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Se connecter" })).toBeOnTheScreen();
  });

  it("dessine l'icône filaire du téléphone", async () => {
    await renderWithSafeArea(<SignInScreen />);

    expect(screen.getByTestId("auth-icon-phone")).toBeOnTheScreen();
  });

  it("formate le numéro pendant la saisie", async () => {
    await renderWithSafeArea(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");

    expect(screen.getByDisplayValue("06 570 66 22")).toBeOnTheScreen();
  });

  it("continue vers le code PIN quand le compte existe sur l'appareil", async () => {
    await registerPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps);
    await renderWithSafeArea(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");
    await fireEvent.press(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/(auth)/pin"));
    expect(useAuthDraft.getState()).toMatchObject({ mode: "sign-in", phone: PHONE });
  });

  it("propose de créer un compte quand le numéro est inconnu ici", async () => {
    await renderWithSafeArea(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");
    await fireEvent.press(screen.getByRole("button", { name: "Se connecter" }));

    expect(await screen.findByText(NO_ACCOUNT_ERROR)).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("signale un trousseau indisponible", async () => {
    mockPinAuth.breakVault();
    await renderWithSafeArea(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");
    await fireEvent.press(screen.getByRole("button", { name: "Se connecter" }));

    expect(await screen.findByText(VAULT_ERROR)).toBeOnTheScreen();
  });

  it("n'avance pas avec un numéro incomplet", async () => {
    await renderWithSafeArea(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "0657");
    await fireEvent.press(screen.getByRole("button", { name: "Se connecter" }));

    expect(router.push).not.toHaveBeenCalled();
  });

  it("ouvre l'inscription depuis le lien", async () => {
    await renderWithSafeArea(<SignInScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Créer un compte" }));

    expect(router.push).toHaveBeenCalledWith("/(auth)/sign-up");
  });
});
