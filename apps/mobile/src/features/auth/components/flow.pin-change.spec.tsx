import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { PIN_REJECTED_MESSAGE } from "../hooks/hook.pin-validation";
import { checkPin, registerPin } from "../model/model.pin-auth";
import { PIN_MISMATCH_MESSAGE, SAME_PIN_MESSAGE } from "../model/model.pin-change";
import { createMemoryPinAuth } from "../testing/mock.pin-auth";
import { PinChange } from "./flow.pin-change";

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

/**
 * Attend l'étape demandée de l'indicateur.
 * @param label Libellé complet de l'étape.
 */
async function expectStep(label: string): Promise<void> {
  expect(await screen.findByRole("progressbar", { name: label })).toBeOnTheScreen();
}

describe("PinChange", () => {
  beforeEach(async () => {
    mockPinAuth.reset();
    useToastStore.getState().dismiss();
    useMemberStore.setState({ ...INITIAL_MEMBER_PROFILE, phone: PHONE });
    await registerPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps);
  });

  it("change le code en trois étapes : actuel, nouveau, confirmation", async () => {
    const onDone = jest.fn();
    await renderWithSafeArea(<PinChange onDone={onDone} />);

    await expectStep("Étape 1 sur 3 : Code actuel");
    await enterPin("4821");
    await expectStep("Étape 2 sur 3 : Nouveau code");
    await enterPin("7305");
    await expectStep("Étape 3 sur 3 : Confirmation");
    await enterPin("7305");

    await waitFor(() => expect(onDone).toHaveBeenCalledTimes(1));
    await expect(checkPin({ phone: PHONE, pin: "7305" }, mockPinAuth.deps)).resolves.toBe(true);
    expect(useToastStore.getState().toast?.message).toBe("Code PIN modifié.");
  });

  it("refuse un code actuel faux", async () => {
    await renderWithSafeArea(<PinChange onDone={jest.fn()} />);

    await enterPin("0000");

    expect(await screen.findByText(PIN_REJECTED_MESSAGE)).toBeOnTheScreen();
  });

  it("refuse un nouveau code identique à l'actuel", async () => {
    await renderWithSafeArea(<PinChange onDone={jest.fn()} />);

    await enterPin("4821");
    await expectStep("Étape 2 sur 3 : Nouveau code");
    await enterPin("4821");

    expect(await screen.findByText(SAME_PIN_MESSAGE)).toBeOnTheScreen();
  });

  it("refuse une confirmation différente, sans changer le code", async () => {
    const onDone = jest.fn();
    await renderWithSafeArea(<PinChange onDone={onDone} />);

    await enterPin("4821");
    await expectStep("Étape 2 sur 3 : Nouveau code");
    await enterPin("7305");
    await expectStep("Étape 3 sur 3 : Confirmation");
    await enterPin("7306");

    expect(await screen.findByText(PIN_MISMATCH_MESSAGE)).toBeOnTheScreen();
    expect(onDone).not.toHaveBeenCalled();
    await expect(checkPin({ phone: PHONE, pin: "4821" }, mockPinAuth.deps)).resolves.toBe(true);
  });
});
