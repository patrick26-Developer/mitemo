import { INITIAL_SESSION, useSessionStore } from "./store.session";

describe("useSessionStore", () => {
  beforeEach(() => useSessionStore.setState(INITIAL_SESSION));

  it("démarre sans session ouverte", () => {
    expect(useSessionStore.getState().signedIn).toBe(false);
  });

  it("ouvre puis ferme la session", () => {
    useSessionStore.getState().signIn();
    expect(useSessionStore.getState().signedIn).toBe(true);

    useSessionStore.getState().signOut();
    expect(useSessionStore.getState().signedIn).toBe(false);
  });
});
