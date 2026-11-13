import { useMoneyFlightStore } from "./store.money-flight";

describe("useMoneyFlightStore", () => {
  beforeEach(() =>
    useMoneyFlightStore.setState({ flight: null, landings: 0, measureTarget: null }),
  );

  it("lance un vol du montant payé, puis le pose sur la cible", () => {
    useMoneyFlightStore.getState().launch(5_500n);
    expect(useMoneyFlightStore.getState().flight).toEqual({ id: 1, amount: 5_500n });

    useMoneyFlightStore.getState().land();
    expect(useMoneyFlightStore.getState().flight).toBeNull();
    expect(useMoneyFlightStore.getState().landings).toBe(1);
  });

  it("retient puis oublie la cible du vol", () => {
    const measure = jest.fn();
    useMoneyFlightStore.getState().registerTarget(measure);
    expect(useMoneyFlightStore.getState().measureTarget).toBe(measure);

    useMoneyFlightStore.getState().registerTarget(null);
    expect(useMoneyFlightStore.getState().measureTarget).toBeNull();
  });
});
