import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { FIELD_CHROME } from "../../../shared/theme/theme.field";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { INITIAL_AUTH_DRAFT, useAuthDraft } from "../model/model.auth-draft";
import { SignUpScreen } from "./screen.sign-up";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));

/**
 * Remplit l'identité, la profession et le numéro du formulaire.
 * @returns Une promesse résolue quand les quatre champs sont saisis.
 */
async function fillForm(): Promise<void> {
  await fireEvent.changeText(screen.getByLabelText("Prénom"), "Aimée");
  await fireEvent.changeText(screen.getByLabelText("Nom"), "Mbemba");
  await fireEvent.changeText(screen.getByLabelText("Profession ou formation"), "Commerçante");
  await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "065706622");
}

describe("SignUpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthDraft.setState(INITIAL_AUTH_DRAFT);
  });

  it("indique la première des deux étapes de l'inscription", async () => {
    await renderWithSafeArea(<SignUpScreen />);

    expect(
      screen.getByRole("progressbar", { name: "Étape 1 sur 2 : Votre identité" }),
    ).toBeOnTheScreen();
  });

  it("affiche les champs d'identité et de profession", async () => {
    await renderWithSafeArea(<SignUpScreen />);

    expect(screen.getByLabelText("Prénom")).toBeOnTheScreen();
    expect(screen.getByLabelText("Nom")).toBeOnTheScreen();
    expect(screen.getByLabelText("Profession ou formation")).toBeOnTheScreen();
  });

  it("dessine une icône filaire sur chaque champ d'identité, pas sur le numéro", async () => {
    await renderWithSafeArea(<SignUpScreen />);

    expect(screen.getByTestId("auth-icon-firstName")).toBeOnTheScreen();
    expect(screen.getByTestId("auth-icon-lastName")).toBeOnTheScreen();
    expect(screen.getByTestId("auth-icon-occupation")).toBeOnTheScreen();
    expect(screen.queryByTestId("auth-icon-phone")).toBeNull();
  });

  it("signale en rouge un numéro faux, sans colorer les champs pas encore remplis", async () => {
    await renderWithSafeArea(<SignUpScreen />);

    await fireEvent.changeText(screen.getByLabelText("Numéro de téléphone"), "123456789");

    expect(screen.getByTestId("phone-field")).toHaveStyle({
      borderColor: FIELD_CHROME.errorBorder,
    });
    expect(screen.getByTestId("auth-field-firstName")).not.toHaveStyle({
      borderColor: FIELD_CHROME.errorBorder,
    });
    expect(screen.getByText(/Entrez un numéro congolais valide/)).toBeOnTheScreen();
  });

  it("affiche des libellés visibles et explique la profession", async () => {
    await renderWithSafeArea(<SignUpScreen />);

    expect(screen.getByText("Prénom")).toBeOnTheScreen();
    expect(screen.getByText("Nom")).toBeOnTheScreen();
    expect(screen.getByText("Profession ou formation")).toBeOnTheScreen();
    expect(screen.getByText("Numéro de téléphone")).toBeOnTheScreen();
    expect(screen.getByText("Sert à adapter vos tontines et votre suivi.")).toBeOnTheScreen();
  });

  it("refuse un prénom trop court", async () => {
    await renderWithSafeArea(<SignUpScreen />);
    await fillForm();
    await fireEvent.changeText(screen.getByLabelText("Prénom"), "A");
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(await screen.findByText(/au moins deux caractères/)).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("exige une profession ou une formation", async () => {
    await renderWithSafeArea(<SignUpScreen />);
    await fillForm();
    await fireEvent.changeText(screen.getByLabelText("Profession ou formation"), " ");
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(await screen.findByText(/profession ou votre formation/)).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("rappelle les conditions d'utilisation avant de continuer", async () => {
    await renderWithSafeArea(<SignUpScreen />);
    await fillForm();
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(screen.getByRole("header", { name: "Conditions d'utilisation" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Refuser" })).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("ne crée rien quand les conditions sont refusées", async () => {
    await renderWithSafeArea(<SignUpScreen />);
    await fillForm();
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));
    await fireEvent.press(screen.getByRole("button", { name: "Refuser" }));

    expect(router.push).not.toHaveBeenCalled();
    expect(useAuthDraft.getState().mode).toBe(INITIAL_AUTH_DRAFT.mode);
    expect(
      screen.getByText("Acceptez les conditions d'utilisation pour créer votre compte."),
    ).toBeOnTheScreen();
  });

  it("continue vers le code PIN avec l'identité saisie, une fois les conditions acceptées", async () => {
    await renderWithSafeArea(<SignUpScreen />);
    await fillForm();
    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));
    await fireEvent.press(screen.getByRole("button", { name: "Accepter" }));

    expect(useAuthDraft.getState()).toMatchObject({
      mode: "sign-up",
      firstName: "Aimée",
      lastName: "Mbemba",
      occupation: "Commerçante",
      name: "Aimée Mbemba",
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
