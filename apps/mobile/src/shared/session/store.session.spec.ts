import { INITIAL_SESSION, restoreSession, useSessionStore } from "./store.session";

describe("useSessionStore", () => {
  beforeEach(() => useSessionStore.setState(INITIAL_SESSION));

  it("démarre sans session ouverte", () => {
    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(useSessionStore.getState().locked).toBe(false);
  });

  it("ouvre puis ferme la session", () => {
    useSessionStore.getState().signIn();
    expect(useSessionStore.getState().signedIn).toBe(true);

    useSessionStore.getState().signOut();
    expect(useSessionStore.getState().signedIn).toBe(false);
  });

  it("verrouille une session ouverte, puis la rouvre au code PIN", () => {
    useSessionStore.getState().signIn();

    useSessionStore.getState().lock();
    expect(useSessionStore.getState()).toMatchObject({ signedIn: true, locked: true });

    useSessionStore.getState().unlock();
    expect(useSessionStore.getState().locked).toBe(false);
  });

  it("ne verrouille rien sans session", () => {
    useSessionStore.getState().lock();

    expect(useSessionStore.getState().locked).toBe(false);
  });

  it("déconnecte complètement : retour au numéro de téléphone", () => {
    useSessionStore.getState().signIn();
    useSessionStore.getState().lock();

    useSessionStore.getState().signOut();

    expect(useSessionStore.getState()).toMatchObject({ signedIn: false, locked: false });
  });
});

describe("restoreSession", () => {
  it("rouvre au prochain démarrage une session restée ouverte, verrouillée", () => {
    expect(restoreSession({ signedIn: true })).toEqual({ signedIn: true, locked: true });
  });

  it("garde fermée une session déconnectée", () => {
    expect(restoreSession({ signedIn: false })).toEqual({ signedIn: false, locked: false });
    expect(restoreSession(undefined)).toEqual({ signedIn: false, locked: false });
  });
});
