import { makePortfolio, TEST_PORTFOLIO } from "../testing/fixtures.portfolio";
import { InsufficientFundsError, InvalidAmountError } from "./model.portfolio-error";

describe("withdrawAvailable", () => {
  it("débite le solde disponible du montant retiré", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, available: 20_000n });

    actions.withdrawAvailable(5_000n);

    expect(state().available).toBe(15_000n);
  });

  it("refuse un montant nul ou supérieur au solde", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, available: 20_000n });

    expect(() => actions.withdrawAvailable(0n)).toThrow(InvalidAmountError);
    expect(() => actions.withdrawAvailable(20_001n)).toThrow(InsufficientFundsError);
    expect(state().available).toBe(20_000n);
  });
});
