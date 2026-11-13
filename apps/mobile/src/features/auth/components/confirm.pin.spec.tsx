import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { PIN_REJECTED_MESSAGE } from "../hooks/hook.pin-validation";
import { registerPin } from "../model/model.pin-auth";
import { createMemoryPinAuth } from "../testing/mock.pin-auth";
import { PinConfirm } from "./confirm.pin";

/** Trousseau en mémoire, partagé avec le module simulé. */
const mockPinAuth = createMemoryPinAuth();

jest.mock("../api/deps.pin-auth", () => ({
  get PIN_AUTH_DEPS() {
    return mockPinAuth.deps;
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

describe("PinConfirm", () => {
  beforeEach(async () => {
    mockPinAuth.reset();
    useMemberStore.setState({ ...INITIAL_MEMBER_PROFILE, phone: PHONE });
    await registerPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps);
  });

  it("valide l'opération avec le code PIN Mitemo du membre", async () => {
    const onConfirmed = jest.fn();
    await renderWithSafeArea(<PinConfirm onConfirmed={onConfirmed} />);

    await enterPin("4821");

    await waitFor(() => expect(onConfirmed).toHaveBeenCalledTimes(1));
  });

  it("accepte le code du compte même si le profil porte un autre numéro", async () => {
    useMemberStore.setState({ phone: "+242 06 512 34 56" });
    const onConfirmed = jest.fn();
    await renderWithSafeArea(<PinConfirm onConfirmed={onConfirmed} />);

    await enterPin("4821");

    await waitFor(() => expect(onConfirmed).toHaveBeenCalledTimes(1));
  });

  it("refuse un mauvais code sans valider l'opération", async () => {
    const onConfirmed = jest.fn();
    await renderWithSafeArea(<PinConfirm onConfirmed={onConfirmed} />);

    await enterPin("0000");

    expect(await screen.findByText(PIN_REJECTED_MESSAGE)).toBeOnTheScreen();
    expect(onConfirmed).not.toHaveBeenCalled();
  });
});
