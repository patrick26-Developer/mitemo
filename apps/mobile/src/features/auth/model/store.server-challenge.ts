import type { StartLoginResponse } from "@mitemo/contracts";
import { create } from "zustand";

/** Défi OTP temporaire ; ni PIN ni OTP saisi ne sont persistés. */
interface ServerChallengeState {
  readonly challenge: StartLoginResponse | null;
  /** Remplace ou efface le défi courant. */
  setChallenge(challenge: StartLoginResponse | null): void;
}

/** Défi conservé seulement en mémoire jusqu'à la vérification OTP. */
export const useServerChallenge = create<ServerChallengeState>((set) => ({
  challenge: null,
  setChallenge: (challenge) => set({ challenge }),
}));
