import { create } from "zustand";

/** Session du membre et actions qui l'ouvrent ou la ferment. */
export interface SessionState {
  /** Vrai une fois le code PIN vérifié, jusqu'à la déconnexion. */
  readonly signedIn: boolean;
  /** Ouvre la session, après un code PIN accepté. */
  signIn(): void;
  /** Ferme la session : les écrans du membre ne sont plus accessibles. */
  signOut(): void;
}

/** Session initiale, fermée. */
export const INITIAL_SESSION = { signedIn: false } as const;

/**
 * Session du membre, volontairement non persistante : chaque ouverture de
 * l'application redemande le code PIN, comme une application bancaire.
 */
export const useSessionStore = create<SessionState>((set) => ({
  ...INITIAL_SESSION,
  signIn: () => set({ signedIn: true }),
  signOut: () => set({ signedIn: false }),
}));
