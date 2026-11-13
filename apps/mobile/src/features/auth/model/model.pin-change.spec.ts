import { createMemoryPinAuth } from "../testing/mock.pin-auth";
import { checkPin, registerPin } from "./model.pin-auth";
import { changePin, isNewPin, PIN_CHANGE_STEPS } from "./model.pin-change";

const PHONE = "+242 06 570 6622";

describe("PIN_CHANGE_STEPS", () => {
  it("demande l'actuel, le nouveau, puis sa confirmation", () => {
    expect(PIN_CHANGE_STEPS.map((step) => step.title)).toEqual([
      "Code actuel",
      "Nouveau code",
      "Confirmation",
    ]);
  });
});

describe("isNewPin", () => {
  it("refuse un nouveau code identique à l'actuel", () => {
    expect(isNewPin("4821", "4821")).toBe(false);
    expect(isNewPin("4821", "7305")).toBe(true);
  });
});

describe("changePin", () => {
  const auth = createMemoryPinAuth();

  beforeEach(async () => {
    auth.reset();
    await registerPin({ phone: PHONE, pin: "4821" }, auth.deps);
  });

  it("remplace le code une fois l'actuel reconnu", async () => {
    await expect(
      changePin({ phone: PHONE, current: "4821", next: "7305" }, auth.deps),
    ).resolves.toBe(true);
    await expect(checkPin({ phone: PHONE, pin: "7305" }, auth.deps)).resolves.toBe(true);
    await expect(checkPin({ phone: PHONE, pin: "4821" }, auth.deps)).resolves.toBe(false);
  });

  it("garde l'ancien code si l'actuel est faux", async () => {
    await expect(
      changePin({ phone: PHONE, current: "0000", next: "7305" }, auth.deps),
    ).resolves.toBe(false);
    await expect(checkPin({ phone: PHONE, pin: "4821" }, auth.deps)).resolves.toBe(true);
  });

  it("refuse un nouveau code identique à l'actuel", async () => {
    await expect(
      changePin({ phone: PHONE, current: "4821", next: "4821" }, auth.deps),
    ).resolves.toBe(false);
  });
});
