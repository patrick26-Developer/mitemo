import {
  failedPinMessage,
  isSuspended,
  MAX_PIN_ATTEMPTS,
  remainingAttempts,
} from "./model.pin-attempts";

describe("remainingAttempts", () => {
  it("part de cinq essais et en retire un par échec", () => {
    expect(MAX_PIN_ATTEMPTS).toBe(5);
    expect(remainingAttempts(0)).toBe(5);
    expect(remainingAttempts(3)).toBe(2);
    expect(remainingAttempts(9)).toBe(0);
  });
});

describe("isSuspended", () => {
  it("suspend le compte au cinquième échec", () => {
    expect(isSuspended(4)).toBe(false);
    expect(isSuspended(5)).toBe(true);
  });
});

describe("failedPinMessage", () => {
  it("annonce les essais restants, au singulier comme au pluriel", () => {
    expect(failedPinMessage(1)).toBe("Code incorrect. Il vous reste 4 essais.");
    expect(failedPinMessage(4)).toBe("Code incorrect. Il vous reste 1 essai.");
  });

  it("annonce la suspension au dernier échec", () => {
    expect(failedPinMessage(5)).toBe(
      "Compte suspendu après 5 codes incorrects. Contactez le service client.",
    );
  });
});
