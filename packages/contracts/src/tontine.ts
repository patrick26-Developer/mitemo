import type { TontineId } from "./identifiers.ts";
import type { MoneyDto } from "./money.ts";

/**
 * États de l'automate tontine (`docs/audit/03-architecture-technique.md`, §2,
 * automate 1). Une tontine commence en `BROUILLON` et se clôt soit normalement,
 * soit par anticipation, soit elle est annulée si le quorum n'est jamais atteint.
 */
export const TONTINE_STATES = [
  "BROUILLON",
  "RECRUTEMENT",
  "COLLECTE_GARANTIES",
  "TIRAGE_ORDRE",
  "ACTIVE",
  "SUSPENDUE",
  "CLOTUREE_NORMALE",
  "CLOTUREE_ANTICIPEE",
  "ANNULEE",
] as const;

/** État de l'automate tontine. Voir {@link TONTINE_STATES}. */
export type TontineState = (typeof TONTINE_STATES)[number];

/**
 * Unités possibles pour la fréquence d'un cycle de tontine
 * (`docs/cahier_des_charges_fonctionnel_mitemo.md`, §1.1) : cycle court (jours),
 * moyen (semaines) ou long (mois).
 */
export const CYCLE_FREQUENCY_UNITS = ["jour", "semaine", "mois"] as const;

/** Unité de fréquence d'un cycle. Voir {@link CYCLE_FREQUENCY_UNITS}. */
export type CycleFrequencyUnit = (typeof CYCLE_FREQUENCY_UNITS)[number];

/**
 * Fréquence des échéances d'une tontine : une unité et un intervalle entier
 * positif (ex. `{ unit: "jour", interval: 2 }` pour « tous les 2 jours »).
 */
export interface CycleFrequency {
  readonly unit: CycleFrequencyUnit;
  /** Entier positif (1 ou plus). Validé côté API, pas par ce type. */
  readonly interval: number;
}

/**
 * Paramètres soumis par l'administrateur à la création d'une tontine
 * (`docs/cahier_des_charges_fonctionnel_mitemo.md`, §1.1).
 */
export interface CreateTontineRequest {
  /** Montant fixe de la cotisation unitaire, en FCFA entiers. */
  readonly contributionAmount: MoneyDto;
  /** Nombre de participants validés pour la rotation. */
  readonly participantCount: number;
  readonly frequency: CycleFrequency;
}

/** Tontine telle que renvoyée par l'API après sa création. */
export interface CreateTontineResponse {
  readonly tontineId: TontineId;
  readonly state: TontineState;
  readonly contributionAmount: MoneyDto;
  readonly participantCount: number;
  readonly frequency: CycleFrequency;
}
