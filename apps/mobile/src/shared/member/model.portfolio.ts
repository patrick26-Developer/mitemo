import { randomUUID } from "expo-crypto";
import type { CycleFrequencyUnit, TontineMemberRole } from "@mitemo/contracts";

/** Identifiant du membre connecté dans les données locales. */
export const SELF_MEMBER_ID = "self";

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
  /** `true` quand la cotisation du tour en cours est réglée. */
  readonly paidCurrentRound: boolean;
}

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
  readonly state: "ACTIVE" | "COMPLETED";
  readonly members: readonly TontineMember[];
  /** Membre qui reçoit la cagnotte du tour en cours. */
  readonly beneficiaryId: string;
  readonly description: string;
  /** Couleurs du dégradé de l'en-tête, du centre vers le bord. */
  readonly headerColors: readonly [string, string];
  /** Code d'invitation, `null` tant que l'administrateur n'en a pas créé. */
  readonly invitationCode: string | null;
}

/** Carte de pointage suivie par le membre. */
export interface SavingsCard {
  readonly id: string;
  readonly name: string;
  /** Montant d'un marqueur, en plus petite unité de la devise (franc CFA). */
  readonly markerAmount: bigint;
  readonly markersTotal: number;
  /** Montant déjà épargné, en plus petite unité de la devise (franc CFA). */
  readonly saved: bigint;
  /** Date limite, au format ISO 8601 UTC (`AAAA-MM-JJ`). */
  readonly deadline: string;
  readonly tint: string;
  readonly state: "ACTIVE" | "COMPLETED";
  readonly description: string;
  /** Tontine rattachée, `null` quand la carte est indépendante. */
  readonly tontineId: string | null;
}

/** Opérations possibles sur une carte de pointage. */
export interface CardCapabilities {
  /** `true` quand un marqueur peut encore être ajouté. */
  readonly canContribute: boolean;
  /** `true` quand l'épargne peut être retirée. */
  readonly canWithdraw: boolean;
  /** `true` quand l'épargne peut régler la cotisation de la tontine rattachée. */
  readonly canTransfer: boolean;
}

/** Pluriel de chaque unité de fréquence, pour les libellés. */
const FREQUENCY_PLURALS: Readonly<Record<CycleFrequencyUnit, string>> = {
  jour: "jours",
  semaine: "semaines",
  mois: "mois",
};

/**
 * Calcule la cagnotte brute d'un tour : cotisation × (participants − 1).
 * @param tontine Tontine concernée.
 * @returns Le montant brut du pot, en plus petite unité de la devise.
 */
export function tontinePot(tontine: Tontine): bigint {
  return tontine.contribution * BigInt(Math.max(tontine.members.length - 1, 0));
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
 * Calcule le nombre de marqueurs déjà validés sur une carte.
 * @param card Carte concernée.
 * @returns Le nombre de marqueurs validés, borné au total de la carte.
 */
export function markersDone(card: SavingsCard): number {
  if (card.markerAmount <= 0n) return 0;

  return Math.min(Number(card.saved / card.markerAmount), card.markersTotal);
}

/**
 * Calcule l'objectif total d'une carte : montant d'un marqueur × marqueurs.
 * @param card Carte concernée.
 * @returns L'objectif, en plus petite unité de la devise.
 */
export function cardGoal(card: SavingsCard): bigint {
  return card.markerAmount * BigInt(card.markersTotal);
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
    canWithdraw: card.saved > 0n,
    canTransfer: card.tontineId !== null && card.state === "ACTIVE",
  };
}

/**
 * Calcule la part validée d'une carte.
 * @param card Carte concernée.
 * @returns La part validée, entre 0 et 1.
 */
export function cardProgress(card: SavingsCard): number {
  if (card.markersTotal <= 0) return 0;

  return Math.min(markersDone(card) / card.markersTotal, 1);
}

/**
 * Additionne l'épargne de toutes les cartes du membre.
 * @param cards Cartes du membre.
 * @returns Le total mis de côté, en plus petite unité de la devise.
 */
export function totalSaved(cards: readonly SavingsCard[]): bigint {
  return cards.reduce((total, card) => total + card.saved, 0n);
}

/**
 * Met en mots la fréquence d'un cycle, par exemple « chaque semaine ».
 * @param frequency Unité et intervalle du cycle.
 * @returns Le libellé de la fréquence.
 */
export function formatFrequency(frequency: TontineFrequency): string {
  if (frequency.interval === 1) return `chaque ${frequency.unit}`;

  return `toutes les ${frequency.interval} ${FREQUENCY_PLURALS[frequency.unit]}`;
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
