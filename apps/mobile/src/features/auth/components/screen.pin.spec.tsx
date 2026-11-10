import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { INITIAL_AUTH_DRAFT, useAuthDraft } from "../model/model.auth-draft";
import { PinScreen } from "./screen.pin";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));

/**
 * Touche les chiffres d'un code, un par un.
 * @param digits Code à saisir.
 */
async function enterPin(digits: string): Promise<void> {
  for (const digit of digits) {
    await fireEvent.press(screen.getByRole("button", { name: digit }));
  }
}

describe("PinScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthDraft.setState(INITIAL_AUTH_DRAFT);
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
  });

  it("affiche quatre cases et le clavier", async () => {
    useAuthDraft.getState().startSignIn("+242 06 570 6622");
    await renderWithSafeArea(<PinScreen />);

    expect(screen.getByText("Code PIN")).toBeOnTheScreen();

    for (const index of [0, 1, 2, 3]) {
      expect(screen.getByTestId(`pin-box-${index}`)).toBeOnTheScreen();
    }

    expect(screen.getByRole("button", { name: "1" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Effacer" })).toBeOnTheScreen();
  });

  it("ouvre la session avec le code de démonstration", async () => {
    useAuthDraft.getState().startSignIn("+242 06 570 6622");
    await renderWithSafeArea(<PinScreen />);

    await enterPin("1234");

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/(tabs)"));
    expect(useAuthDraft.getState().phone).toBe("");
  });

  it("ne renvoie pas vers la connexion après une réussite", async () => {
    useAuthDraft.getState().startSignIn("+242 06 570 6622");
    await renderWithSafeArea(<PinScreen />);

    await enterPin("1234");
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/(tabs)"));

    await act(async () => {});

    expect(router.replace).not.toHaveBeenCalledWith("/(auth)/sign-in");
  });

  it("efface le code et signale une erreur", async () => {
    useAuthDraft.getState().startSignIn("+242 06 570 6622");
    await renderWithSafeArea(<PinScreen />);

    await enterPin("0000");

    expect(await screen.findByText(/Code incorrect/)).toBeOnTheScreen();
    expect(router.replace).not.toHaveBeenCalled();
    expect(screen.getByTestId("pin-box-0")).not.toHaveTextContent("•");
  });

  it("enregistre l'identité à la fin d'une inscription", async () => {
    useAuthDraft
      .getState()
      .startSignUp(
        { firstName: "Aimée", lastName: "Mbemba", occupation: "Commerçante" },
        "+242 06 570 6622",
      );
    await renderWithSafeArea(<PinScreen />);

    await enterPin("1234");

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/(tabs)"));
    expect(useMemberStore.getState().name).toBe("Aimée Mbemba");
    expect(useMemberStore.getState().occupation).toBe("Commerçante");
    expect(useMemberStore.getState().phone).toBe("+242 06 570 6622");

    await act(async () => {});

    expect(router.replace).not.toHaveBeenCalledWith("/(auth)/sign-in");
  });

  it("revient à la connexion sans brouillon", async () => {
    await renderWithSafeArea(<PinScreen />);

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/(auth)/sign-in"));
  });
});
