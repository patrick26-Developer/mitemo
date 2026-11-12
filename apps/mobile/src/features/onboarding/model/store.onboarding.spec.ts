import { useOnboardingStore } from "./store.onboarding";

describe("useOnboardingStore", () => {
  beforeEach(() => {
    useOnboardingStore.setState({ completed: false });
  });

  it("n'a pas encore présenté l'application au premier lancement", () => {
    expect(useOnboardingStore.getState().completed).toBe(false);
  });

  it("retient que la présentation a été vue", () => {
    useOnboardingStore.getState().complete();

    expect(useOnboardingStore.getState().completed).toBe(true);
  });
});
