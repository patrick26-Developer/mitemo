import type { IsoDateTime } from "./datetime.ts";
import type { LoginChallengeId, UserId } from "./identifiers.ts";

/**
 * Rôles de la démonstration. Ils sont vérifiés par l'API sur chaque requête :
 * l'interface ne fait que les refléter, elle ne protège rien.
 */
export const USER_ROLES = ["USER", "ADMIN"] as const;

/** Rôle d'un utilisateur. Voir {@link USER_ROLES}. */
export type UserRole = (typeof USER_ROLES)[number];

/** Étape 1 de la connexion : numéro de téléphone et PIN. */
export interface StartLoginRequest {
  /** Numéro au format international E.164, par exemple « +242061234567 ». */
  readonly phoneNumber: string;
  /** PIN à six chiffres. Jamais journalisé ni renvoyé par l'API. */
  readonly pin: string;
}

/**
 * Réponse à l'étape 1 quand le numéro et le PIN sont corrects. Aucun SMS n'est
 * envoyé pendant la démonstration : l'OTP est simulé et renvoyé ici pour être
 * affiché à l'écran, clairement signalé comme tel.
 */
export interface StartLoginResponse {
  readonly challengeId: LoginChallengeId;
  readonly expiresAt: IsoDateTime;
  /** OTP simulé, à six chiffres. Disparaîtra quand un vrai envoi de SMS existera. */
  readonly simulatedOtp: string;
}

/** Étape 2 de la connexion : l'OTP reçu à l'étape 1. */
export interface VerifyLoginRequest {
  readonly challengeId: LoginChallengeId;
  readonly otp: string;
  /** Optional display label for the session device. */
  readonly deviceLabel?: string;
}

/** Utilisateur connecté, tel que l'API le connaît. */
export interface CurrentUser {
  readonly userId: UserId;
  readonly displayName: string;
  /** Numéro masqué, par exemple « 06*****67 » : jamais le numéro complet. */
  readonly maskedPhoneNumber: string;
  readonly role: UserRole;
}

/**
 * Session ouverte après l'étape 2. Le jeton est opaque pour les clients et
 * s'envoie dans l'en-tête `Authorization: Bearer <accessToken>`.
 */
export interface SessionResponse {
  readonly accessToken: string;
  readonly expiresAt: IsoDateTime;
  readonly user: CurrentUser;
}

/** Creates a demonstration account with an international phone number and server PIN. */
export interface RegisterDemoUserRequest extends StartLoginRequest {
  readonly displayName: string;
}

/** Changes the public display name of the authenticated user. */
export interface UpdateCurrentUserRequest {
  readonly displayName: string;
}

/** Describes an active session without exposing its bearer credential. */
export interface ActiveSession {
  readonly id: string;
  readonly deviceLabel: string | null;
  readonly createdAt: IsoDateTime;
  readonly expiresAt: IsoDateTime;
  readonly current: boolean;
}
