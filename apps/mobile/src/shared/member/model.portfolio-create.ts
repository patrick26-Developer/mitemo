import type { SavingsCard, Tontine, TontineFrequency, TontineMember } from "./model.portfolio";
import { createId, SELF_MEMBER_ID } from "./model.portfolio";

/** Noms proposés aux membres invités lors d'une création locale. */
const MEMBER_NAME_POOL = [
  "Mama Nadège",
  "Jean-Baptiste Okemba",
  "Clarisse Nzaba",
  "Serge Makosso",
  "Pauline Elenga",
  "Alphonse Mabiala",
  "Léonie Bantsimba",
  "David Nkodia",
  "Sylvie Tchicaya",
] as const;

/** Dégradés des nouvelles tontines, du centre vers le bord. */
const TONTINE_TINTS: readonly (readonly [string, string])[] = [
  ["#2CCA86", "#62F79D"],
  ["#F5B94A", "#FAD98C"],
  ["#9DB6F5", "#C9D6FF"],
  ["#F2A0B5", "#FBD0DA"],
];

/** Teintes des nouvelles cartes de pointage. */
const CARD_TINTS = ["#CFD8FF", "#CDF5DD", "#F5D7B0", "#F2C9E4"] as const;

/** Nom du membre connecté, tant que l'authentification n'est pas branchée. */
const SELF_NAME = "Précieuse Mavoungou";

/** Paramètres saisis pour créer une tontine. */
export interface CreateTontineInput {
  readonly name: string;
  readonly contribution: bigint;
  readonly frequency: TontineFrequency;
  readonly participantCount: number;
  readonly description: string;
}

/** Paramètres saisis pour créer une carte de pointage. */
export interface CreateCardInput {
  readonly name: string;
  /** Objectif d'épargne, en plus petite unité de la devise. */
  readonly goal: bigint;
  /** Montant proposé à chaque pointage, en plus petite unité de la devise. */
  readonly markerAmount: bigint;
  /** Nombre de marqueurs déduit du rythme et de l'échéance. */
  readonly markersTotal: number;
  readonly frequency: TontineFrequency;
  /** Date de création du plan, en ISO 8601 UTC (`AAAA-MM-JJ`). */
  readonly startDate: string;
  readonly deadline: string;
  readonly tontineId: string | null;
  readonly description: string;
}

/**
 * Construit le membre invité qui prend le rang donné.
 * @param index Rang de l'invité, à partir de 0.
 * @returns Le membre, cotisation du tour en cours non réglée.
 */
export function buildInvitedMember(index: number): TontineMember {
  return {
    id: `member-${index + 1}`,
    name: MEMBER_NAME_POOL[index] ?? `Membre ${index + 2}`,
    role: "MEMBRE",
    paidCurrentRound: false,
  };
}

/**
 * Construit le membre connecté, administrateur d'une nouvelle tontine.
 * @returns Son adhésion, cotisation du tour en cours non réglée.
 */
function buildSelfMember(): TontineMember {
  return {
    id: SELF_MEMBER_ID,
    name: SELF_NAME,
    role: "ADMIN",
    paidCurrentRound: false,
  };
}

/**
 * Construit une tontine à partir du formulaire de création.
 * @param input Paramètres saisis.
 * @param index Rang de la tontine, pour choisir son dégradé.
 * @returns La tontine prête à être ajoutée.
 */
export function buildTontine(input: CreateTontineInput, index: number): Tontine {
  const members = [buildSelfMember()];

  return {
    id: createId("tontine"),
    name: input.name,
    contribution: input.contribution,
    frequency: input.frequency,
    round: 1,
    totalRounds: input.participantCount,
    state: "PENDING",
    members,
    beneficiaryId: SELF_MEMBER_ID,
    description: input.description,
    headerColors: TONTINE_TINTS[index % TONTINE_TINTS.length] ?? ["#2CCA86", "#62F79D"],
    invitationCode: null,
  };
}

/**
 * Construit une carte à partir du formulaire de création.
 * @param input Paramètres saisis.
 * @param index Rang de la carte, pour choisir sa teinte.
 * @returns La carte prête à être ajoutée.
 */
export function buildCard(input: CreateCardInput, index: number): SavingsCard {
  return {
    id: createId("card"),
    name: input.name,
    goal: input.goal,
    markerAmount: input.markerAmount,
    markersTotal: input.markersTotal,
    frequency: input.frequency,
    startDate: input.startDate,
    saved: 0n,
    deadline: input.deadline,
    tint: CARD_TINTS[index % CARD_TINTS.length] ?? "#CFD8FF",
    state: "ACTIVE",
    description: input.description,
    tontineId: input.tontineId,
  };
}
