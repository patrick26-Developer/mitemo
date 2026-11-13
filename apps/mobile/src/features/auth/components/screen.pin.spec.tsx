import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

import { useCelebrationStore } from "../../../shared/feedback/store.celebration";
import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { INITIAL_SESSION, useSessionStore } from "../../../shared/session/store.session";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { PIN_UNAVAILABLE_MESSAGE } from "../hooks/hook.pin-validation";
import { INITIAL_AUTH_DRAFT, useAuthDraft } from "../model/model.auth-draft";
import { checkPin, registerPin } from "../model/model.pin-auth";
import { createMemoryPinAuth } from "../testing/mock.pin-auth";
import { PinScreen } from "./screen.pin";

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

jest.mock("../../../shared/model/model.clock", () => ({ todayUtc: () => "2026-11-11" }));

const PHONE = "+242 06 570 6622";

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
    useCelebrationStore.setState({ burst: null });
    jest.clearAllMocks();
    mockPinAuth.reset();
    useAuthDraft.setState(INITIAL_AUTH_DRAFT);
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
    useSessionStore.setState(INITIAL_SESSION);
  });

  it("affiche quatre cases et le clavier", async () => {
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);

    expect(screen.getByText("Code PIN")).toBeOnTheScreen();

    for (const index of [0, 1, 2, 3]) {
      expect(screen.getByTestId(`pin-box-${index}`)).toBeOnTheScreen();
    }

    expect(screen.getByRole("button", { name: "1" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Effacer" })).toBeOnTheScreen();
  });

  it("ouvre la session avec le code choisi à l'inscription", async () => {
    await registerPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps);
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);

    await enterPin("4821");

    await waitFor(() => expect(useSessionStore.getState().signedIn).toBe(true));
    expect(useCelebrationStore.getState().burst).toBeNull();
    expect(useAuthDraft.getState().phone).toBe("");
    expect(useSessionStore.getState().signedIn).toBe(true);
  });

  it("n'affiche aucun code de démonstration", async () => {
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);

    expect(screen.queryByText(/démonstration/)).toBeNull();
  });

  it("ne renvoie pas vers la connexion après une réussite", async () => {
    await registerPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps);
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);

    await enterPin("4821");
    await waitFor(() => expect(useSessionStore.getState().signedIn).toBe(true));

    await act(async () => {});

    expect(router.replace).not.toHaveBeenCalledWith("/(auth)/sign-in");
  });

  it("efface le code et signale une erreur", async () => {
    await registerPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps);
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);

    await enterPin("0000");

    expect(await screen.findByText(/Code incorrect/)).toBeOnTheScreen();
    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(screen.getByTestId("pin-box-0")).not.toHaveTextContent("•");
    expect(useSessionStore.getState().signedIn).toBe(false);
  });

  it("signale une vérification impossible", async () => {
    mockPinAuth.breakVault();
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);

    await enterPin("4821");

    expect(await screen.findByText(PIN_UNAVAILABLE_MESSAGE)).toBeOnTheScreen();
    expect(useSessionStore.getState().signedIn).toBe(false);
  });

  it("indique la deuxième étape de l'inscription", async () => {
    useAuthDraft
      .getState()
      .startSignUp({ firstName: "Aimée", lastName: "Mbemba", occupation: "Commerçante" }, PHONE);
    await renderWithSafeArea(<PinScreen />);

    expect(
      screen.getByRole("progressbar", { name: "Étape 2 sur 2 : Votre code PIN" }),
    ).toBeOnTheScreen();
  });

  it("n'affiche pas d'étape à la connexion", async () => {
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);

    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("fait confirmer le code choisi, puis enregistre l'identité à la fin d'une inscription", async () => {
    useAuthDraft
      .getState()
      .startSignUp({ firstName: "Aimée", lastName: "Mbemba", occupation: "Commerçante" }, PHONE);
    await renderWithSafeArea(<PinScreen />);

    await enterPin("4821");
    expect(
      await screen.findByText("Saisissez à nouveau votre code pour le confirmer."),
    ).toBeOnTheScreen();
    expect(useSessionStore.getState().signedIn).toBe(false);
    await enterPin("4821");

    await waitFor(() => expect(useSessionStore.getState().signedIn).toBe(true));
    await expect(checkPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps)).resolves.toBe(true);
    expect(useMemberStore.getState().name).toBe("Aimée Mbemba");
    expect(useMemberStore.getState().occupation).toBe("Commerçante");
    expect(useMemberStore.getState().phone).toBe(PHONE);
    expect(useMemberStore.getState().createdAt).toBe("2026-11-11");
    expect(useCelebrationStore.getState().burst).not.toBeNull();

    await act(async () => {});

    expect(router.replace).not.toHaveBeenCalledWith("/(auth)/sign-in");
  });

  it("refuse une confirmation différente du code choisi", async () => {
    useAuthDraft
      .getState()
      .startSignUp({ firstName: "Aimée", lastName: "Mbemba", occupation: "Commerçante" }, PHONE);
    await renderWithSafeArea(<PinScreen />);

    await enterPin("4821");
    await screen.findByText("Saisissez à nouveau votre code pour le confirmer.");
    await enterPin("1111");

    expect(
      await screen.findByText("Les deux codes ne correspondent pas. Réessayez."),
    ).toBeOnTheScreen();
    expect(useSessionStore.getState().signedIn).toBe(false);
    await expect(checkPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps)).resolves.toBe(false);
  });

  it("revient au choix du code depuis la confirmation", async () => {
    useAuthDraft
      .getState()
      .startSignUp({ firstName: "Aimée", lastName: "Mbemba", occupation: "Commerçante" }, PHONE);
    await renderWithSafeArea(<PinScreen />);

    await enterPin("4821");
    await screen.findByText("Saisissez à nouveau votre code pour le confirmer.");
    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(
      screen.getByText("Choisissez un code à 4 chiffres pour sécuriser votre compte."),
    ).toBeOnTheScreen();
    expect(router.back).not.toHaveBeenCalled();
  });

  it("revient à la connexion sans brouillon", async () => {
    await renderWithSafeArea(<PinScreen />);

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/(auth)/sign-in"));
  });

  it("explique le code oublié dans une feuille, pas dans une alerte", async () => {
    useAuthDraft.getState().startSignIn(PHONE);
    await renderWithSafeArea(<PinScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Code PIN oublié" }));

    expect(screen.getByRole("header", { name: "Code PIN oublié" })).toBeOnTheScreen();
    expect(screen.getByText(/réinitialisation par SMS/)).toBeOnTheScreen();
  });
});
