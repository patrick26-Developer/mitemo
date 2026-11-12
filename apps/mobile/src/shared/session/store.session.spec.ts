import { INITIAL_SESSION, useSessionStore } from "./store.session";
import type { CurrentUser } from "@mitemo/contracts";

describe("useSessionStore", () => {
  beforeEach(() => useSessionStore.setState(INITIAL_SESSION));

  it("démarre sans session ouverte", () => {
    expect(useSessionStore.getState().signedIn).toBe(false);
  });

  it("ouvre puis ferme la session", () => {
    const user = {
      userId: "019a6f4b-e680-7000-8000-000000000001",
      displayName: "Aimée Mbemba",
      maskedPhoneNumber: "+242*****22",
      role: "USER",
    } as CurrentUser;
    useSessionStore.getState().signIn(user);
    expect(useSessionStore.getState().signedIn).toBe(true);
    expect(useSessionStore.getState().user).toEqual(user);

    useSessionStore.getState().signOut();
    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(useSessionStore.getState().user).toBeNull();
  });
});
