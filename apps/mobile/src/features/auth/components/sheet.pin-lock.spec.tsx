import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { INITIAL_SESSION, useSessionStore } from "../../../shared/session/store.session";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { registerPin } from "../model/model.pin-auth";
import { usePinAttemptsStore } from "../model/store.pin-attempts";
import { createMemoryPinAuth } from "../testing/mock.pin-auth";
import { PinLockSheet } from "./sheet.pin-lock";

/** Trousseau en mémoire, partagé avec le module simulé. */
const mockPinAuth = createMemoryPinAuth();

jest.mock("../api/deps.pin-auth", () => ({
  get PIN_AUTH_DEPS() {
    return mockPinAuth.deps;
  },
}));

jest.mock("../../../shared/support/config.support", () => ({
  supportApi: {
    contact: jest.fn(async () => ({ phoneNumber: "+242065706622", maxAgeSeconds: 86_400 })),
  },
}));

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

describe("PinLockSheet", () => {
  beforeEach(async () => {
    mockPinAuth.reset();
    usePinAttemptsStore.setState({ failures: {} });
    useMemberStore.setState({ ...INITIAL_MEMBER_PROFILE, name: "Grâce MBEMBA", phone: PHONE });
    useSessionStore.setState({ ...INITIAL_SESSION, signedIn: true, locked: true });
    await registerPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps);
  });

  it("ne demande que le code PIN, sans croix pour fermer, et cache l'application", async () => {
    await renderWithSafeArea(<PinLockSheet />);

    expect(screen.getByRole("header", { name: "Bon retour, Grâce" })).toBeOnTheScreen();
    expect(screen.getByTestId("pin-lock-curtain")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Fermer" })).toBeNull();
    expect(screen.queryByLabelText(/Téléphone/)).toBeNull();
  });

  it("rouvre la session avec le bon code", async () => {
    await renderWithSafeArea(<PinLockSheet />);

    await enterPin("4821");

    await waitFor(() => expect(useSessionStore.getState().locked).toBe(false));
    expect(useSessionStore.getState().signedIn).toBe(true);
  });

  it("rouvre la session même quand le profil porte encore le numéro de démonstration", async () => {
    useMemberStore.setState({ phone: "+242 06 512 34 56" });
    await renderWithSafeArea(<PinLockSheet />);

    await enterPin("4821");

    await waitFor(() => expect(useSessionStore.getState().locked).toBe(false));
  });

  it("revient au numéro de téléphone en changeant de compte", async () => {
    await renderWithSafeArea(<PinLockSheet />);

    await fireEvent.press(screen.getByRole("button", { name: "Changer de compte" }));

    expect(useSessionStore.getState().signedIn).toBe(false);
  });

  it("annonce un compte suspendu avec le service client", async () => {
    usePinAttemptsStore.setState({ failures: { [PHONE]: 5 } });
    await renderWithSafeArea(<PinLockSheet />);

    expect(screen.getByRole("header", { name: "Compte suspendu" })).toBeOnTheScreen();
    expect(
      await screen.findByRole("button", { name: "Appeler le service client" }),
    ).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "1" })).toBeNull();
  });

  it("ne rend rien tant que la session n'est pas verrouillée", async () => {
    useSessionStore.setState({ ...INITIAL_SESSION, signedIn: true });
    await renderWithSafeArea(<PinLockSheet />);

    expect(screen.queryByTestId("pin-lock-curtain")).toBeNull();
  });
});
