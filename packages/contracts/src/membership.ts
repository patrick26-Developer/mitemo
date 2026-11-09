import type { IsoDateTime } from "./datetime.ts";
import type { InvitationToken, MemberId, TontineId } from "./identifiers.ts";

/**
 * États de l'automate d'adhésion d'un membre à une tontine
 * (`docs/audit/03-architecture-technique.md`, §2, automate 2). L'adhésion
 * commence par une invitation et se termine par l'exclusion, la sortie
 * volontaire ou une succession (décès, incapacité).
 */
export const MEMBERSHIP_STATES = [
  "INVITE",
  "ACCEPTE",
  "GARANTIE_BLOQUEE",
  "ACTIF",
  "EN_ATTENTE",
  "GELE_24H",
  "INCIDENT",
  "EXCLU",
  "SORTANT",
  "SUCCESSION",
] as const;

/** État de l'automate d'adhésion. Voir {@link MEMBERSHIP_STATES}. */
export type MembershipState = (typeof MEMBERSHIP_STATES)[number];

/**
 * Demande de création d'un jeton d'invitation pour une tontine
 * (aucune intégration spontanée - `docs/cahier_des_charges_fonctionnel_mitemo.md`, §1.2).
 */
export interface CreateInvitationRequest {
  readonly tontineId: TontineId;
}

/** Jeton d'invitation créé, à usage unique et borné dans le temps. */
export interface CreateInvitationResponse {
  readonly token: InvitationToken;
  readonly tontineId: TontineId;
  readonly createdAt: IsoDateTime;
  readonly expiresAt: IsoDateTime;
}

/** Demande d'adhésion à une tontine par présentation d'un jeton d'invitation. */
export interface JoinTontineRequest {
  readonly token: InvitationToken;
  readonly memberId: MemberId;
}

/** Résultat de l'adhésion : l'état initial dépend du blocage de la garantie. */
export interface JoinTontineResponse {
  readonly tontineId: TontineId;
  readonly memberId: MemberId;
  readonly state: MembershipState;
  readonly joinedAt: IsoDateTime;
}
