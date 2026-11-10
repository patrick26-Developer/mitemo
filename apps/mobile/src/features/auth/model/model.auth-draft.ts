import { create } from "zustand";

import { formatFullName } from "../../../shared/format/format.full-name";

/** Étapes d'authentification proposées. */
export const AUTH_MODES = ["sign-in", "sign-up"] as const;

/** Mode de connexion ou d'inscription. Voir {@link AUTH_MODES}. */
export type AuthMode = (typeof AUTH_MODES)[number];

/** Identité recueillie à l'inscription. */
export interface SignUpIdentity {
  readonly firstName: string;
  readonly lastName: string;
  /** Profession ou formation, utilisée pour les indicateurs de suivi. */
  readonly occupation: string;
}

/** Identité retenue entre deux étapes du parcours. */
export interface AuthDraftState {
  readonly mode: AuthMode;
  readonly firstName: string;
  readonly lastName: string;
  readonly occupation: string;
  /** Nom complet dérivé, affiché après l'inscription. */
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
   * @param identity Prénom, nom et profession saisis.
   * @param phone Numéro au format international.
   */
  startSignUp(identity: SignUpIdentity, phone: string): void;
  /** Efface le parcours après une connexion ou une inscription réussie. */
  reset(): void;
}

/** Brouillon initial, avant toute saisie. */
export const INITIAL_AUTH_DRAFT = {
  mode: "sign-in",
  firstName: "",
  lastName: "",
  occupation: "",
  name: "",
  phone: "",
} as const satisfies Omit<AuthDraftState, "startSignIn" | "startSignUp" | "reset">;

/**
 * Brouillon d'authentification, volontairement non persistant : l'identité et
 * le numéro ne vivent que le temps du parcours, jamais sur l'appareil.
 */
export const useAuthDraft = create<AuthDraftState>((set) => ({
  ...INITIAL_AUTH_DRAFT,
  startSignIn: (phone) =>
    set({
      ...INITIAL_AUTH_DRAFT,
      mode: "sign-in",
      phone,
    }),
  startSignUp: ({ firstName, lastName, occupation }, phone) =>
    set({
      mode: "sign-up",
      firstName,
      lastName,
      occupation,
      name: formatFullName(firstName, lastName),
      phone,
    }),
  reset: () => set(INITIAL_AUTH_DRAFT),
}));
