import type { IsoDateTime } from "./datetime.ts";
import type { MemberId, RoundId, TontineId } from "./identifiers.ts";
import type { MoneyDto } from "./money.ts";
import type { MembershipState } from "./membership.ts";

/**
 * États de l'automate d'un tour de distribution (`docs/audit/03-architecture-technique.md`,
 * §2, automate 3). Un tour planifié collecte les cotisations puis distribue la
 * cagnotte ; la réserve de sécurité peut combler un défaut, et une panne de
 * l'opérateur peut faire échouer la distribution elle-même.
 */
export const ROUND_STATES = [
  "PLANIFIE",
  "OUVERT",
  "COLLECTE_EN_COURS",
  "COMPLET",
  "DISTRIBUE",
  "SOLDE",
  "COUVERT_PAR_RESERVE",
  "ECHEC_DISTRIBUTION",
] as const;

/** État de l'automate d'un tour. Voir {@link ROUND_STATES}. */
export type RoundState = (typeof ROUND_STATES)[number];

/**
 * Décisions possibles à l'échéance d'un tour
 * (`docs/cahier_des_charges_fonctionnel_mitemo.md`, §2.2). L'argent ne part
 * jamais sans l'une de ces deux actions humaines explicites.
 */
export const ARBITRATION_DECISIONS = ["ACCEPTER", "ANNULER"] as const;

/** Décision d'arbitrage. Voir {@link ARBITRATION_DECISIONS}. */
export type ArbitrationDecision = (typeof ARBITRATION_DECISIONS)[number];

/** Choix du membre au moment où le transfert doit s'effectuer vers la tontine. */
export interface ArbitrateRequest {
  readonly memberId: MemberId;
  readonly roundId: RoundId;
  readonly decision: ArbitrationDecision;
}

/**
 * Résultat de l'arbitrage. `state` reflète l'état d'adhésion qui en découle
 * (`ACTIF` après acceptation, `GELE_24H` après annulation).
 */
export interface ArbitrateResponse {
  readonly roundId: RoundId;
  readonly memberId: MemberId;
  readonly decision: ArbitrationDecision;
  readonly state: MembershipState;
  readonly decidedAt: IsoDateTime;
}

/**
 * Résultat de la distribution d'un tour (`docs/cahier_des_charges_fonctionnel_mitemo.md`,
 * §2.5 ; convention de calcul : `docs/audit/03-architecture-technique.md`, §3.1).
 * `commission` et `netAmount` sont toujours calculés par l'API : un client ne
 * doit jamais recalculer ces montants lui-même.
 */
export interface DistributeRoundResponse {
  readonly roundId: RoundId;
  readonly tontineId: TontineId;
  readonly beneficiaryId: MemberId;
  /** Cagnotte brute : cotisation unitaire × (nombre de participants − 1). */
  readonly grossAmount: MoneyDto;
  /** Commission de la plateforme, 1,5 % de la cagnotte brute, arrondie. */
  readonly commission: MoneyDto;
  /** Montant effectivement versé au bénéficiaire (`grossAmount` − `commission`). */
  readonly netAmount: MoneyDto;
  readonly state: RoundState;
  readonly distributedAt: IsoDateTime;
}
