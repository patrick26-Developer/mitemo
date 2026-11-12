import { create } from "zustand";
import type { CurrentUser } from "@mitemo/contracts";

/** Session du membre et actions qui l'ouvrent ou la ferment. */
export interface SessionState {
  /** Vrai après vérification OTP ou restauration validée par le serveur. */
  readonly signedIn: boolean;
  /** Profil attesté par le serveur ; aucune identité de démonstration implicite. */
  readonly user: CurrentUser | null;
  /** Ouvre la session avec le profil attesté par le serveur. */
  signIn(user: CurrentUser): void;
  /** Ferme la session : les écrans du membre ne sont plus accessibles. */
  signOut(): void;
}

/** Session initiale, fermée. */
export const INITIAL_SESSION = { signedIn: false, user: null } as const;

/**
 * Profil en mémoire ; le jeton persiste uniquement dans le trousseau sécurisé.
 * Au redémarrage, le serveur doit confirmer le profil avant de rouvrir les écrans.
 */
export const useSessionStore = create<SessionState>((set) => ({
  ...INITIAL_SESSION,
  signIn: (user) => set({ signedIn: true, user }),
  signOut: () => set(INITIAL_SESSION),
}));
