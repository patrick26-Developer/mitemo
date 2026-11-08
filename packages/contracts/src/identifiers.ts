import type { Brand } from "./brand.ts";

/** Identifiant d'un groupe de cotisation (UUID v7 attribué par l'API). */
export type GroupId = Brand<string, "GroupId">;

/** Identifiant d'un membre (UUID v7 attribué par l'API). */
export type MemberId = Brand<string, "MemberId">;

/** Identifiant d'une cotisation (UUID v7 attribué par l'API). */
export type ContributionId = Brand<string, "ContributionId">;

/** Identifiant d'une tontine (UUID v7 attribué par l'API). */
export type TontineId = Brand<string, "TontineId">;

/** Identifiant d'un tour de distribution au sein d'une tontine (UUID v7 attribué par l'API). */
export type RoundId = Brand<string, "RoundId">;

/** Identifiant d'une transaction du grand livre (UUID v7 attribué par l'API). */
export type TransactionId = Brand<string, "TransactionId">;

/**
 * Jeton d'invitation cryptographique à usage unique, requis pour rejoindre une
 * tontine (aucune intégration spontanée — voir `docs/cahier_des_charges_fonctionnel_mitemo.md`,
 * section 1.2). Ce n'est pas un identifiant de ressource : il est consommé à l'adhésion.
 */
export type InvitationToken = Brand<string, "InvitationToken">;

/** Identifiant d'un compte utilisateur de MITEMO (UUID v7 attribué par l'API). */
export type UserId = Brand<string, "UserId">;

/** Identifiant d'une carte de pointage (UUID v7 attribué par l'API). */
export type SavingsCardId = Brand<string, "SavingsCardId">;

/** Identifiant d'un mouvement affiché dans l'historique du portefeuille. */
export type MovementId = Brand<string, "MovementId">;

/**
 * Identifiant d'une tentative de connexion en cours, entre la vérification du
 * PIN et celle de l'OTP. À usage unique, expire rapidement.
 */
export type LoginChallengeId = Brand<string, "LoginChallengeId">;

/** Identifiant d'un programme de ristourne collective (UUID v7 attribué par l'API). */
export type RistourneId = Brand<string, "RistourneId">;
