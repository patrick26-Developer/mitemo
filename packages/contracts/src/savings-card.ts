import type { IsoDateTime } from "./datetime.ts";
import type { SavingsCardId, TontineId } from "./identifiers.ts";
import type { MoneyDto } from "./money.ts";

/** Périodicités des échéances d'un programme : quotidienne, hebdomadaire, mensuelle. */
export const SCHEDULE_FREQUENCIES = ["DAILY", "WEEKLY", "MONTHLY"] as const;

/** Périodicité d'un programme. Voir {@link SCHEDULE_FREQUENCIES}. */
export type ScheduleFrequency = (typeof SCHEDULE_FREQUENCIES)[number];

/** États d'une carte de pointage. */
export const SAVINGS_CARD_STATES = ["ACTIVE", "COMPLETED", "CANCELLED"] as const;

/** État d'une carte de pointage. Voir {@link SAVINGS_CARD_STATES}. */
export type SavingsCardState = (typeof SAVINGS_CARD_STATES)[number];

/**
 * États d'une échéance : à venir, exigible aujourd'hui, en retard, versée.
 * Calculés par l'API à partir de la date de l'échéance et des versements.
 */
export const INSTALLMENT_STATES = ["UPCOMING", "DUE", "LATE", "PAID"] as const;

/** État d'une échéance. Voir {@link INSTALLMENT_STATES}. */
export type InstallmentState = (typeof INSTALLMENT_STATES)[number];

/** Conditions d'une carte de pointage, choisies par l'utilisateur. */
export interface SavingsCardTerms {
  /** Montant de chaque versement, strictement positif, en FCFA entiers. */
  readonly installmentAmount: MoneyDto;
  readonly frequency: ScheduleFrequency;
  /** Nombre de versements dans un cycle (entier, 1 ou plus). */
  readonly installmentsPerCycle: number;
  /** Nombre de cycles de la carte (entier, 1 ou plus). */
  readonly cycleCount: number;
  /** Date de la première échéance, en UTC. */
  readonly startsAt: IsoDateTime;
}

/**
 * Frais appliqués à une carte : un montant fixe par cycle, lu dans une
 * politique versionnée. La version acceptée est figée sur la carte et ne
 * change plus, même si la politique change ensuite.
 */
export interface SavingsCardFee {
  readonly policyVersion: string;
  readonly feePerCycle: MoneyDto;
  /**
   * `true` tant que le montant est une valeur illustrative de démonstration
   * et non un tarif commercial adopté. À afficher comme tel.
   */
  readonly illustrative: boolean;
}

/**
 * Devis calculé par l'API avant tout engagement : le client ne calcule jamais
 * lui-même un frais. Il se demande avec un corps {@link SavingsCardTerms}.
 */
export interface SavingsCardQuoteResponse {
  readonly terms: SavingsCardTerms;
  /** Montant × versements par cycle × nombre de cycles. */
  readonly totalToSave: MoneyDto;
  /** Frais par cycle × nombre de cycles. */
  readonly totalFees: MoneyDto;
  /** Ce que l'utilisateur récupère si tous les versements sont faits. */
  readonly netPayout: MoneyDto;
  readonly fee: SavingsCardFee;
}

/**
 * Création d'une carte. Refusée si `acceptedFeePolicyVersion` n'est plus la
 * version en vigueur : l'utilisateur doit revoir un devis à jour.
 */
export interface CreateSavingsCardRequest {
  readonly name: string;
  readonly terms: SavingsCardTerms;
  readonly acceptedFeePolicyVersion: string;
  /**
   * Tontine à laquelle rattacher la carte, pour y verser directement ses
   * cotisations. Absent : la carte reste indépendante.
   */
  readonly linkedTontineId?: TontineId;
}

/** Échéance du calendrier d'une carte. */
export interface Installment {
  /** Rang de l'échéance, à partir de 1. */
  readonly index: number;
  readonly dueAt: IsoDateTime;
  readonly amount: MoneyDto;
  readonly state: InstallmentState;
  /** Présent seulement quand l'échéance est versée. */
  readonly paidAt?: IsoDateTime;
}

/** Carte de pointage avec son calendrier et le solde de sa caisse. */
export interface SavingsCardResponse {
  readonly savingsCardId: SavingsCardId;
  readonly name: string;
  readonly state: SavingsCardState;
  readonly terms: SavingsCardTerms;
  readonly fee: SavingsCardFee;
  /** Solde de la caisse de la carte, calculé à partir du grand livre. */
  readonly caisseBalance: MoneyDto;
  readonly installments: readonly Installment[];
  readonly createdAt: IsoDateTime;
  /** Tontine rattachée à la carte, absente quand la carte est indépendante. */
  readonly linkedTontineId?: TontineId;
}

/**
 * Versement d'une cotisation de tontine depuis la caisse d'une carte
 * rattachée. La requête porte l'en-tête `Idempotency-Key`.
 */
export interface TransferSavingsToTontineRequest {
  readonly savingsCardId: SavingsCardId;
  readonly tontineId: TontineId;
  /** Montant strictement positif, en FCFA entiers. */
  readonly amount: MoneyDto;
}

/** Résultat d'un versement de la caisse d'une carte vers sa tontine. */
export interface TransferSavingsToTontineResponse {
  readonly savingsCardId: SavingsCardId;
  readonly tontineId: TontineId;
  readonly amount: MoneyDto;
  readonly caisseBalance: MoneyDto;
  readonly transferredAt: IsoDateTime;
}

/**
 * Versement d'une échéance depuis le solde disponible du portefeuille. La
 * requête porte l'en-tête `Idempotency-Key`.
 */
export interface PayInstallmentRequest {
  readonly installmentIndex: number;
}
