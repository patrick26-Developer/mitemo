import { usePinAttemptsStore } from "./store.pin-attempts";

const PHONE = "+242 06 570 6622";

describe("usePinAttemptsStore", () => {
  beforeEach(() => usePinAttemptsStore.setState({ failures: {} }));

  it("compte les échecs par numéro", () => {
    usePinAttemptsStore.getState().recordFailure(PHONE);

    expect(usePinAttemptsStore.getState().recordFailure(PHONE)).toBe(2);
    expect(usePinAttemptsStore.getState().failures["+242 05 555 1234"]).toBeUndefined();
  });

  it("remet le compteur à zéro après un code juste", () => {
    usePinAttemptsStore.getState().recordFailure(PHONE);

    usePinAttemptsStore.getState().clear(PHONE);

    expect(usePinAttemptsStore.getState().failures[PHONE]).toBeUndefined();
  });
});
