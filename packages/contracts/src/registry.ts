import type { CycleFrequency, CreateTontineRequest } from "./tontine.ts";
import type { IsoDateTime } from "./datetime.ts";
import type { TontineId, UserId } from "./identifiers.ts";
import type { MoneyDto } from "./money.ts";

/** Paramètres du groupe Registre, indépendant des opérations financières. */
export interface RegistryCreateGroupRequest extends CreateTontineRequest {
  readonly name: string;
}

/** Règles gratuites du pilote, dont la version est acceptée à l'adhésion. */
export interface RegistryFreePolicy {
  readonly version: "registry-free-v1";
  readonly mode: "FREE";
  /** Frais Mitemo en XAF entiers, toujours nuls dans le pilote. */
  readonly mitemoFee: "0";
  /** Frais opérateur en XAF entiers, aucun paiement partenaire actif. */
  readonly operatorFee: "0";
  /** Rémunération responsable inactive dans ce premier lot. */
  readonly responsibleFee: "0";
}

/** Groupe déclaratif consultable par ses membres authentifiés. */
export interface RegistryGroupResponse {
  readonly id: TontineId;
  readonly name: string;
  readonly ownerId: UserId;
  readonly contributionAmount: MoneyDto;
  readonly participantCount: number;
  readonly frequencyUnit: CycleFrequency["unit"];
  readonly frequencyInterval: number;
  readonly state: "RECRUTEMENT";
  readonly mode: "REGISTRY";
  readonly createdAt: IsoDateTime;
  readonly feePolicy: RegistryFreePolicy;
}

/** Invitation nominative à un compte Mitemo existant. */
export interface RegistryInviteRequest {
  readonly userId: UserId;
}

/** Acceptation explicite de la politique gratuite présentée au destinataire. */
export interface RegistryAcceptInvitationRequest {
  readonly acceptedPolicyVersion: "registry-free-v1";
}
