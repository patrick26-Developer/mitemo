import { create } from "zustand";

/** Étapes d'authentification proposées. */
export const AUTH_MODES = ["sign-in", "sign-up"] as const;

/** Mode de connexion ou d'inscription. Voir {@link AUTH_MODES}. */
export type AuthMode = (typeof AUTH_MODES)[number];

/** Identité retenue entre deux étapes du parcours. */
export interface AuthDraftState {
  readonly mode: AuthMode;
  readonly name: string;
  /** Numéro au format international. */
  readonly phone: string;
  /**
   * Retient le numéro de la connexion avant l'étape du PIN.
   * @param phone Numéro au format international.
   */
  startSignIn(phone: string): void;
  /**
   * Retient l'identité de l'inscription avant l'étape du PIN.
   * @param name Nom affiché du nouveau membre.
   * @param phone Numéro au format international.
   */
  startSignUp(name: string, phone: string): void;
  /** Efface le parcours après une connexion ou une inscription réussie. */
  reset(): void;
}

/** Brouillon initial, avant toute saisie. */
export const INITIAL_AUTH_DRAFT = {
  mode: "sign-in",
  name: "",
  phone: "",
} as const satisfies Pick<AuthDraftState, "mode" | "name" | "phone">;

/**
 * Brouillon d'authentification, volontairement non persistant : le numéro et
 * le nom ne vivent que le temps du parcours, jamais sur l'appareil.
 */
export const useAuthDraft = create<AuthDraftState>((set) => ({
  ...INITIAL_AUTH_DRAFT,
  startSignIn: (phone) => set({ mode: "sign-in", name: "", phone }),
  startSignUp: (name, phone) => set({ mode: "sign-up", name, phone }),
  reset: () => set(INITIAL_AUTH_DRAFT),
}));
