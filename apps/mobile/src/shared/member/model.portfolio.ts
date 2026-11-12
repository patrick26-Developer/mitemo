import { randomUUID } from "expo-crypto";
import type { CycleFrequencyUnit, TontineMemberRole } from "@mitemo/contracts";

import type { PaymentMethod } from "../model/model.payment-method";
import type { TontineActivity } from "./model.tontine-activity";
import { takenTurns } from "./model.tontine-turns";

export { SELF_MEMBER_ID } from "./model.self-member";
import { SELF_MEMBER_ID } from "./model.self-member";

/** Fréquence d'un cycle de tontine, telle qu'affichée dans l'application. */
export interface TontineFrequency {
  readonly unit: CycleFrequencyUnit;
  /** Entier positif : 1 pour « chaque semaine », 2 pour « toutes les 2 semaines ». */
  readonly interval: number;
}

/** Membre d'une tontine, tel que stocké sur l'appareil. */
export interface TontineMember {
  readonly id: string;
  readonly name: string;
  readonly role: TontineMemberRole;
  /** Numéro au format international E.164, connu quand le membre vient du répertoire. */
  readonly phone?: string;
  /** `true` quand la cotisation du tour en cours est réglée, pour tous ses tours. */
  readonly paidCurrentRound: boolean;
  /**
   * Nombre de tours pris, au moins 1 : chaque tour est une part, cotisée à
   * chaque tour et touchée une fois.
   */
  readonly turns: number;
  /**
   * Tours suivants déjà cotisés d'avance, 0 par défaut : chacun règle
   * d'office la cotisation d'un tour à venir.
   */
  readonly prepaidRounds?: number;
}

/** Invitation envoyée par l'administrateur, en attente de la réponse du contact. */
export interface PendingInvitation {
  readonly id: string;
  readonly name: string;
  /** Numéro au format international E.164. */
  readonly phone: string;
}

/** États d'une tontine : en préparation, en cours, terminée. */
export const TONTINE_STATES = ["PENDING", "ACTIVE", "COMPLETED"] as const;

/** État d'une tontine. Voir {@link TONTINE_STATES}. */
export type TontineState = (typeof TONTINE_STATES)[number];

/** Tontine suivie par le membre. */
export interface Tontine {
  readonly id: string;
  readonly name: string;
  /** Cotisation d'un tour, en plus petite unité de la devise (franc CFA). */
  readonly contribution: bigint;
  readonly frequency: TontineFrequency;
  /** Tour en cours, à partir de 1. */
  readonly round: number;
  readonly totalRounds: number;
  /** `PENDING` avant le départ, `ACTIVE` pendant le cycle, `COMPLETED` après. */
  readonly state: TontineState;
  /** Membres qui ont accepté leur invitation, dans l'ordre de passage. */
  readonly members: readonly TontineMember[];
  /** Invitations envoyées qui attendent l'acceptation ou le refus du contact. */
  readonly invitations: readonly PendingInvitation[];
  /** Membre qui reçoit la cagnotte du tour en cours. */
  readonly beneficiaryId: string;
  readonly description: string;
  /** Couleurs du dégradé de l'en-tête, du centre vers le bord. */
  readonly headerColors: readonly [string, string];
  /** Code d'invitation, `null` tant que l'administrateur n'en a pas créé. */
  readonly invitationCode: string | null;
  /** Fil de la tontine, du plus ancien au plus récent ; vide par défaut. */
  readonly activity?: readonly TontineActivity[];
}

/** Carte de pointage suivie par le membre. */
export interface SavingsCard {
  readonly id: string;
  readonly name: string;
  /** Objectif d'épargne, en plus petite unité de la devise (franc CFA). */
  readonly goal: bigint;
  /** Montant proposé à chaque pointage, en plus petite unité de la devise. */
  readonly markerAmount: bigint;
  readonly markersTotal: number;
  /** Rythme des pointages, déduit de l'échéance à la création. */
  readonly frequency: TontineFrequency;
  /** Date de création du plan, en ISO 8601 UTC (`AAAA-MM-JJ`). */
  readonly startDate: string;
  /** Montant déjà épargné, en plus petite unité de la devise (franc CFA). */
  readonly saved: bigint;
  /** Date limite, au format ISO 8601 UTC (`AAAA-MM-JJ`). */
  readonly deadline: string;
  readonly tint: string;
  /**
   * `ACTIVE` tant que l'objectif n'est pas atteint, `COMPLETED` une fois rempli,
   * `ARCHIVED` une fois l'épargne retirée : la carte reste consultable.
   */
  readonly state: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  readonly description: string;
  /** Tontine rattachée, `null` quand la carte est indépendante. */
  readonly tontineId: string | null;
  /**
   * Frais Mitemo dus à la création, 10 % de l'objectif, en plus petite unité
   * de la devise.
   */
  readonly fee: bigint;
  /** Pointages faits, du plus ancien au plus récent. */
  readonly entries: readonly CardEntry[];
}

/** Pointage fait sur une carte. */
export interface CardEntry {
  /** Instant du pointage, en ISO 8601 UTC. */
  readonly at: string;
  /** Montant pointé, en plus petite unité de la devise. */
  readonly amount: bigint;
  /** Opérateur mobile qui a réglé le pointage. */
  readonly method: PaymentMethod;
}

/** Règlement d'un pointage : son instant et l'opérateur choisi, sans le montant fixé par la carte. */
export type CardPayment = Omit<CardEntry, "amount">;

/** Opérations possibles sur une carte de pointage. */
export interface CardCapabilities {
  /** `true` quand un marqueur peut encore être ajouté. */
  readonly canContribute: boolean;
  /** `true` quand l'épargne peut être retirée : seulement une fois l'objectif atteint. */
  readonly canWithdraw: boolean;
  /** `true` quand l'épargne peut régler la cotisation de la tontine rattachée. */
  readonly canTransfer: boolean;
}

/** Pluriel de chaque unité de fréquence, précédé de son déterminant accordé. */
const FREQUENCY_PLURALS: Readonly<Record<CycleFrequencyUnit, string>> = {
  jour: "tous les {n} jours",
  semaine: "toutes les {n} semaines",
  mois: "tous les {n} mois",
};

/**
 * Calcule la cagnotte brute d'un tour : cotisation × (parts − 1), chaque tour
 * pris étant une part. Une tontine en préparation compte les tours prévus, pas
 * seulement ceux déjà pris, pour annoncer la cagnotte que le récapitulatif a
 * promise.
 * @param tontine Tontine concernée.
 * @returns Le montant brut du pot, en plus petite unité de la devise.
 */
export function tontinePot(tontine: Tontine): bigint {
  const participants = tontine.state === "PENDING" ? tontine.totalRounds : takenTurns(tontine);

  return tontine.contribution * BigInt(Math.max(participants - 1, 0));
}

/**
 * Indique si le membre connecté administre la tontine.
 * @param tontine Tontine concernée.
 * @returns `true` quand son rôle est administrateur.
 */
export function isTontineAdmin(tontine: Tontine): boolean {
  return tontine.members.some((member) => member.id === SELF_MEMBER_ID && member.role === "ADMIN");
}

/**
 * Indique si le membre connecté reçoit la cagnotte du tour en cours.
 * @param tontine Tontine concernée.
 * @returns `true` quand il est le bénéficiaire.
 */
export function isTontineBeneficiary(tontine: Tontine): boolean {
  return tontine.beneficiaryId === SELF_MEMBER_ID;
}

/**
 * Indique si le membre connecté peut régler sa cotisation du tour en cours.
 * @param tontine Tontine concernée.
 * @returns `true` quand il participe, n'a pas encore payé et que la tontine est active.
 */
export function canPayContribution(tontine: Tontine): boolean {
  const self = tontine.members.find((member) => member.id === SELF_MEMBER_ID);
  return tontine.state === "ACTIVE" && self !== undefined && !self.paidCurrentRound;
}

/**
 * Compte les membres qui ont réglé la cotisation du tour en cours.
 * @param tontine Tontine concernée.
 * @returns Le nombre de cotisations réglées.
 */
export function paidMemberCount(tontine: Tontine): number {
  return tontine.members.filter((member) => member.paidCurrentRound).length;
}

/**
 * Indique si la tontine a réuni tous les participants prévus.
 * @param tontine Tontine concernée.
 * @returns `true` quand les tours pris atteignent le nombre de tours prévu.
 */
export function hasReachedQuota(tontine: Tontine): boolean {
  return takenTurns(tontine) >= tontine.totalRounds;
}

/**
 * Indique si tous les membres ont réglé la cotisation du tour en cours.
 * @param tontine Tontine concernée.
 * @returns `true` quand chaque membre a payé et que la tontine compte des membres.
 */
export function allMembersPaid(tontine: Tontine): boolean {
  return tontine.members.length > 0 && tontine.members.every((member) => member.paidCurrentRound);
}

/**
 * Indique si l'administrateur peut lancer la tontine.
 * @param tontine Tontine concernée.
 * @returns `true` quand la tontine attend son départ et que le quota est atteint.
 */
export function canStartTontine(tontine: Tontine): boolean {
  return tontine.state === "PENDING" && isTontineAdmin(tontine) && hasReachedQuota(tontine);
}

/**
 * Indique si l'administrateur peut confirmer la restourne du tour.
 * @param tontine Tontine concernée.
 * @returns `true` quand la tontine est active et que tous les membres ont payé.
 */
export function canConfirmRound(tontine: Tontine): boolean {
  return tontine.state === "ACTIVE" && isTontineAdmin(tontine) && allMembersPaid(tontine);
}

/** Cotisation d'un membre pour un tour donné, telle qu'affichée dans l'historique. */
export interface MemberContribution {
  /** Tour concerné, à partir de 1. */
  readonly round: number;
  readonly paid: boolean;
}

/**
 * Reconstitue l'historique de cotisation d'un membre : tous les tours déjà
 * clôturés ont été réglés, le tour en cours dépend de sa cotisation.
 * @param tontine Tontine concernée.
 * @param memberId Membre dont on affiche l'historique.
 * @returns Les tours, du premier au tour en cours.
 */
export function memberContributions(
  tontine: Tontine,
  memberId: string,
): readonly MemberContribution[] {
  const member = tontine.members.find((entry) => entry.id === memberId);
  if (member === undefined || tontine.state === "PENDING") return [];

  return Array.from({ length: tontine.round }, (_, index) => ({
    round: index + 1,
    paid: index + 1 < tontine.round || member.paidCurrentRound,
  }));
}

/**
 * Calcule le nombre de marqueurs déjà validés sur une carte.
 * @param card Carte concernée.
 * @returns Le nombre de marqueurs validés, borné au total de la carte.
 */
export function markersDone(card: SavingsCard): number {
  if (card.markerAmount <= 0n) return 0;

  return Math.min(Number(card.saved / card.markerAmount), card.markersTotal);
}

/**
 * Donne l'objectif d'épargne d'une carte.
 * @param card Carte concernée.
 * @returns L'objectif, en plus petite unité de la devise.
 */
export function cardGoal(card: SavingsCard): bigint {
  return card.goal;
}

/**
 * Calcule la part remplie du marqueur en cours, quand un versement plus élevé
 * que le montant proposé entame le carré suivant.
 * @param card Carte concernée.
 * @returns Le pourcentage rempli du prochain marqueur, entre 0 et 100.
 */
export function markerFill(card: SavingsCard): number {
  const done = markersDone(card);
  if (card.markerAmount <= 0n || done >= card.markersTotal) return 0;

  const remainder = card.saved - card.markerAmount * BigInt(done);

  return Number((remainder * 100n) / card.markerAmount);
}

/**
 * Calcule le nombre de marqueurs qui restent à valider.
 * @param card Carte concernée.
 * @returns Le nombre de marqueurs restants, jamais négatif.
 */
export function remainingMarkers(card: SavingsCard): number {
  return Math.max(card.markersTotal - markersDone(card), 0);
}

/**
 * Calcule le montant qui reste à épargner pour atteindre l'objectif.
 * @param card Carte concernée.
 * @returns Le reste à épargner, jamais négatif.
 */
export function remainingToSave(card: SavingsCard): bigint {
  const goal = cardGoal(card);
  return goal > card.saved ? goal - card.saved : 0n;
}

/**
 * Indique les opérations possibles sur une carte de pointage.
 * @param card Carte concernée.
 * @returns Les capacités de versement, de retrait et de rattachement.
 */
export function cardCapabilities(card: SavingsCard): CardCapabilities {
  return {
    canContribute: card.state === "ACTIVE" && card.saved < cardGoal(card),
    canWithdraw: card.state !== "ARCHIVED" && card.saved > 0n && card.saved >= cardGoal(card),
    canTransfer: card.tontineId !== null && card.state === "ACTIVE",
  };
}

/**
 * Calcule la part validée d'une carte.
 * @param card Carte concernée.
 * @returns La part validée, entre 0 et 1.
 */
export function cardProgress(card: SavingsCard): number {
  if (card.goal <= 0n) return 0;

  return Math.min(Number((card.saved * 1_000n) / card.goal) / 1_000, 1);
}

/**
 * Additionne l'épargne de toutes les cartes du membre.
 * @param cards Cartes du membre.
 * @returns Le total mis de côté, en plus petite unité de la devise.
 */
export function totalSaved(cards: readonly SavingsCard[]): bigint {
  return cards.reduce(
    (total, card) => (card.state === "ARCHIVED" ? total : total + card.saved),
    0n,
  );
}

/**
 * Met en mots la fréquence d'un cycle, par exemple « chaque semaine ».
 * @param frequency Unité et intervalle du cycle.
 * @returns Le libellé de la fréquence.
 */
export function formatFrequency(frequency: TontineFrequency): string {
  if (frequency.interval === 1) return `chaque ${frequency.unit}`;

  return FREQUENCY_PLURALS[frequency.unit].replace("{n}", String(frequency.interval));
}

/**
 * Retrouve le nom d'un membre d'une tontine.
 * @param tontine Tontine concernée.
 * @param memberId Membre recherché.
 * @returns Son nom, ou « Membre inconnu » s'il a quitté la tontine.
 */
export function memberName(tontine: Tontine, memberId: string): string {
  return tontine.members.find((member) => member.id === memberId)?.name ?? "Membre inconnu";
}

/**
 * Retrouve le nom du membre qui reçoit la cagnotte du tour en cours.
 * @param tontine Tontine concernée.
 * @returns Le nom du bénéficiaire.
 */
export function beneficiaryName(tontine: Tontine): string {
  return memberName(tontine, tontine.beneficiaryId);
}

/**
 * Construit un identifiant local unique, tiré du générateur cryptographique
 * du système plutôt que de l'heure.
 * @param prefix Préfixe qui rattache l'identifiant à son type d'entité.
 * @param generate Générateur d'UUID, injecté pour les tests.
 * @returns L'identifiant, par exemple « tontine-6f1c…-9b2e ».
 */
export function createId(prefix: string, generate: () => string = randomUUID): string {
  return `${prefix}-${generate()}`;
}
