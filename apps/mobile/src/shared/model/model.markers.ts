import type { TontineFrequency } from "../member/model.portfolio";

/** Millisecondes d'un jour, pour compter les périodes en UTC. */
const DAY_MS = 86_400_000;

/** Plan de pointage d'une carte, tel que saisi à la création. */
export interface MarkerPlan {
  /** Rythme d'un pointage. */
  readonly frequency: TontineFrequency;
  /** Date de départ du plan, en ISO 8601 UTC (`AAAA-MM-JJ`). */
  readonly start: string;
  /** Date limite du plan, en ISO 8601 UTC (`AAAA-MM-JJ`). */
  readonly deadline: string;
}

/**
 * Décale une date d'un nombre de mois, en bornant le jour à la fin du mois.
 * @param isoDate Date de départ, en ISO 8601 UTC.
 * @param months Nombre de mois à ajouter, éventuellement négatif.
 * @returns La date décalée, en ISO 8601 UTC.
 */
function shiftMonths(isoDate: string, months: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));

  return date.toISOString().slice(0, 10);
}

/**
 * Compte les mois entamés entre deux dates : un mois commencé compte entier.
 * @param start Date de départ, en ISO 8601 UTC.
 * @param deadline Date limite, en ISO 8601 UTC.
 * @returns Le nombre de mois entamés, positif ou nul.
 */
function monthsBetween(start: string, deadline: string): number {
  const from = new Date(`${start}T00:00:00.000Z`);
  const to = new Date(`${deadline}T00:00:00.000Z`);
  const months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());

  return months + (shiftMonths(start, months) < deadline ? 1 : 0);
}

/**
 * Compte les périodes entamées d'une unité entre deux dates.
 * @param frequency Fréquence du plan.
 * @param start Date de départ, en ISO 8601 UTC.
 * @param deadline Date limite, en ISO 8601 UTC.
 * @returns Le nombre de périodes entamées, positif ou nul.
 */
function periodsBetween(frequency: TontineFrequency, start: string, deadline: string): number {
  if (frequency.unit === "mois") return monthsBetween(start, deadline);

  const days = Math.round((Date.parse(deadline) - Date.parse(start)) / DAY_MS);
  return Math.ceil(days / (frequency.unit === "semaine" ? 7 : 1));
}

/**
 * Début du n-ième pointage d'un plan, compté depuis le départ : chaque date
 * est calculée depuis le départ pour qu'un mois court ne décale pas la suite.
 * @param plan Rythme et départ du plan.
 * @param index Rang du pointage, 0 pour le premier.
 * @returns La date de début, en ISO 8601 UTC (`AAAA-MM-JJ`).
 */
export function markerStart(plan: Omit<MarkerPlan, "deadline">, index: number): string {
  const steps = index * plan.frequency.interval;
  if (plan.frequency.unit === "mois") return shiftMonths(plan.start, steps);
  const days = steps * (plan.frequency.unit === "semaine" ? 7 : 1);
  return new Date(Date.parse(`${plan.start}T00:00:00.000Z`) + days * DAY_MS)
    .toISOString()
    .slice(0, 10);
}

/**
 * Calcule le nombre de marqueurs d'une carte à partir du rythme choisi, de la
 * date de création et de l'échéance. Une période entamée compte un marqueur.
 * @param plan Rythme, départ et échéance du plan.
 * @returns Le nombre de marqueurs, au moins un.
 */
export function markersForPlan(plan: MarkerPlan): number {
  const periods = periodsBetween(plan.frequency, plan.start, plan.deadline);
  if (periods <= 0) return 1;

  return Math.max(Math.ceil(periods / plan.frequency.interval), 1);
}
