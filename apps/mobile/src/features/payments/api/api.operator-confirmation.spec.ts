import { SIMULATED_CONFIRMATION_MS, awaitOperatorConfirmation } from "./api.operator-confirmation";

describe("awaitOperatorConfirmation", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("se résout quand le serveur confirme le paiement", async () => {
    const confirmed = jest.fn();
    const request = { method: "MTN_MOMO", amount: 5_000n } as const;
    void awaitOperatorConfirmation(request, new AbortController().signal).then(confirmed);

    jest.advanceTimersByTime(SIMULATED_CONFIRMATION_MS - 1);
    await Promise.resolve();
    expect(confirmed).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await Promise.resolve();
    expect(confirmed).toHaveBeenCalledWith(request);
  });

  it("ne confirme rien quand l'attente est annulée", async () => {
    const confirmed = jest.fn();
    const controller = new AbortController();
    void awaitOperatorConfirmation(
      { method: "AIRTEL_MONEY", amount: 5_000n },
      controller.signal,
    ).then(confirmed);

    controller.abort();
    jest.advanceTimersByTime(SIMULATED_CONFIRMATION_MS);
    await Promise.resolve();

    expect(confirmed).not.toHaveBeenCalled();
  });
});
