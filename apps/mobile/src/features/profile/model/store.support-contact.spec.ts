import { useSupportContactStore } from "./store.support-contact";

describe("useSupportContactStore", () => {
  beforeEach(() => useSupportContactStore.setState({ cache: null }));

  it("garde le numéro reçu, l'heure de réception et sa durée de vie", () => {
    useSupportContactStore
      .getState()
      .save({ phoneNumber: "+242065706622", maxAgeSeconds: 86_400 }, Date.UTC(2026, 10, 13, 8));

    expect(useSupportContactStore.getState().cache).toEqual({
      phoneNumber: "+242065706622",
      maxAgeSeconds: 86_400,
      fetchedAt: Date.UTC(2026, 10, 13, 8),
    });
  });
});
