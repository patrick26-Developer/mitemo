import AsyncStorage from "@react-native-async-storage/async-storage";

import { bigintReplacer } from "./model.bigint-json";
import { INITIAL_PORTFOLIO, PORTFOLIO_STORAGE_KEY } from "./model.portfolio-initial";
import { PORTFOLIO_STORAGE_VERSION, usePortfolioStore } from "./store.portfolio";

/**
 * Enregistre un portefeuille sur l'appareil, comme une version précédente.
 * @param state État enregistré.
 * @param version Version du format enregistré.
 */
async function storePortfolio(state: unknown, version: number): Promise<void> {
  await AsyncStorage.setItem(
    PORTFOLIO_STORAGE_KEY,
    JSON.stringify({ state, version }, bigintReplacer),
  );
}

describe("usePortfolioStore", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    usePortfolioStore.getState().reset();
  });

  it("remplace un portefeuille d'un ancien format par les données de départ", async () => {
    await storePortfolio(
      { available: 1_000n, tontines: [], cards: [{ id: "old", name: "Ancienne" }] },
      0,
    );

    await usePortfolioStore.persist.rehydrate();

    expect(usePortfolioStore.getState().cards).toEqual(INITIAL_PORTFOLIO.cards);
    expect(usePortfolioStore.getState().available).toBe(INITIAL_PORTFOLIO.available);
  });

  it("garde un portefeuille enregistré au format courant", async () => {
    await storePortfolio({ ...INITIAL_PORTFOLIO, available: 3_000n }, PORTFOLIO_STORAGE_VERSION);

    await usePortfolioStore.persist.rehydrate();

    expect(usePortfolioStore.getState().available).toBe(3_000n);
  });
});
