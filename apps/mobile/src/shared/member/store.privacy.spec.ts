import { INITIAL_PRIVACY, usePrivacyStore } from "./store.privacy";

describe("usePrivacyStore", () => {
  beforeEach(() => {
    usePrivacyStore.setState(INITIAL_PRIVACY);
  });

  it("affiche les montants au premier lancement", () => {
    expect(usePrivacyStore.getState().amountsHidden).toBe(false);
  });

  it("masque puis réaffiche les montants à chaque appui", () => {
    usePrivacyStore.getState().toggleAmounts();
    expect(usePrivacyStore.getState().amountsHidden).toBe(true);

    usePrivacyStore.getState().toggleAmounts();
    expect(usePrivacyStore.getState().amountsHidden).toBe(false);
  });
});
