import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Session du membre : ouverte, et verrouillée ou non. */
export interface SessionState {
  /** Vrai une fois le code PIN vérifié, jusqu'à la déconnexion. */
  readonly signedIn: boolean;
  /**
   * Vrai quand la session reste ouverte mais demande le code PIN : après une
   * inactivité ou au démarrage suivant.
   */
  readonly locked: boolean;
  /** Ouvre la session, après un code PIN accepté. */
  signIn(): void;
  /** Ferme la session : retour au numéro de téléphone. */
  signOut(): void;
  /** Verrouille une session ouverte ; seul le code PIN la rouvre. */
  lock(): void;
  /** Rouvre la session verrouillée, après un code PIN accepté. */
  unlock(): void;
}

/** Session fermée, au premier lancement ou après une déconnexion. */
export const INITIAL_SESSION = { signedIn: false, locked: false } as const;

/** Clé de stockage de la session sur l'appareil. */
export const SESSION_STORAGE_KEY = "mitemo-session";

/** Partie gardée sur l'appareil : seulement l'ouverture de la session. */
interface PersistedSession {
  readonly signedIn: boolean;
}

/**
 * Restaure la session au démarrage : restée ouverte, elle revient
 * verrouillée et ne demande que le code PIN, pas le numéro.
 * @param persisted Session gardée, absente au premier lancement.
 * @returns L'ouverture et le verrou de la session.
 */
export function restoreSession(
  persisted: PersistedSession | undefined,
): Pick<SessionState, "signedIn" | "locked"> {
  const signedIn = persisted?.signedIn === true;

  return { signedIn, locked: signedIn };
}

/** Session du membre, gardée sur l'appareil entre deux lancements. */
export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      ...INITIAL_SESSION,
      signIn: () => set({ signedIn: true, locked: false }),
      signOut: () => set(INITIAL_SESSION),
      lock: () => set({ locked: get().signedIn }),
      unlock: () => set({ locked: false }),
    }),
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): PersistedSession => ({ signedIn: state.signedIn }),
      merge: (persisted, current) => ({
        ...current,
        ...restoreSession(persisted as PersistedSession | undefined),
      }),
    },
  ),
);
