import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { INITIAL_AUTH_DRAFT, useAuthDraft } from "../model/auth-draft";
import { SignInScreen } from "./sign-in-screen";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));

describe("SignInScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthDraft.setState(INITIAL_AUTH_DRAFT);
  });

  it("affiche la saisie du numéro", async () => {
    await renderWithSafeArea(<SignInScreen />);

    expect(screen.getByText("Bon retour !")).toBeOnTheScreen();
    expect(screen.getByText("+242")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Se connecter" })).toBeOnTheScreen();
  });

  it("formate le numéro pendant la saisie", async () => {
    await renderWithSafeArea(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");

    expect(screen.getByDisplayValue("06 570 66 22")).toBeOnTheScreen();
  });

  it("continue vers le code PIN avec un numéro valide", async () => {
    await renderWithSafeArea(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");
    await fireEvent.press(screen.getByRole("button", { name: "Se connecter" }));

    expect(useAuthDraft.getState()).toMatchObject({
      mode: "sign-in",
      phone: "+242 06 570 6622",
    });
    expect(router.push).toHaveBeenCalledWith("/(auth)/pin");
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
