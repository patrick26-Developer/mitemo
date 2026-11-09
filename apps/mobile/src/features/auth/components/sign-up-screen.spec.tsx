import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { INITIAL_AUTH_DRAFT, useAuthDraft } from "../model/auth-draft";
import { SignUpScreen } from "./sign-up-screen";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));

describe("SignUpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthDraft.setState(INITIAL_AUTH_DRAFT);
  });

  it("refuse un nom trop court", async () => {
    await renderWithSafeArea(<SignUpScreen />);

    await fireEvent.changeText(screen.getByLabelText("Nom complet"), "A");
    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(await screen.findByText(/au moins deux caractères/)).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("continue vers le code PIN avec l'identité saisie", async () => {
    await renderWithSafeArea(<SignUpScreen />);

    await fireEvent.changeText(screen.getByLabelText("Nom complet"), "Aimée");
    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(useAuthDraft.getState()).toMatchObject({
      mode: "sign-up",
      name: "Aimée",
      phone: "+242 06 570 6622",
    });
    expect(router.push).toHaveBeenCalledWith("/(auth)/pin");
  });

  it("revient à la connexion depuis le lien", async () => {
    await renderWithSafeArea(<SignUpScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Se connecter" }));

    expect(router.replace).toHaveBeenCalledWith("/(auth)/sign-in");
  });
});
