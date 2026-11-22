import type { Tontine, TontineFrequency } from "./model.portfolio";
import { ForbiddenOperationError } from "./model.portfolio-error";
import { requireAdmin } from "./model.portfolio-update";

/** Dégradés proposés pour l'en-tête d'une tontine : couleur principale, puis sa teinte claire. */
export const TONTINE_TINTS: readonly (readonly [string, string])[] = [
  ["#2CCA86", "#62F79D"],
  ["#F5B94A", "#FAD98C"],
  ["#9DB6F5", "#C9D6FF"],
  ["#F2A0B5", "#FBD0DA"],
  ["#A78BFA", "#D8CBFE"],
  ["#F59E7A", "#FBCFBC"],
  ["#3CC7C2", "#A3ECE8"],
  ["#5EB8F2", "#B8DFFA"],
  ["#D6CF45", "#EFEA9C"],
  ["#C77DBA", "#EAC6E3"],
  ["#CDB38A", "#EADFCB"],
  ["#94A3B8", "#CFD7E3"],
];

/** Nom de chaque dégradé, lu par les lecteurs d'écran. */
export const TONTINE_TINT_LABELS: readonly string[] = [
  "Vert",
  "Ambre",
  "Bleu",
  "Rose",
  "Violet",
  "Corail",
  "Turquoise",
  "Ciel",
  "Citron",
  "Prune",
  "Sable",
  "Ardoise",
];

/** Réglages qu'un administrateur peut modifier. */
export interface TontineSettings {
  readonly name: string;
  readonly description: string;
  readonly headerColors: readonly [string, string];
  /** Cotisation par tour, en FCFA entiers. Figée une fois la tontine lancée. */
  readonly contribution: bigint;
  /** Fréquence des tours. Figée une fois la tontine lancée. */
  readonly frequency: TontineFrequency;
}

/**
 * Réglages actuels d'une tontine.
 * @param tontine Tontine concernée.
 * @returns Ses réglages modifiables.
 */
export function tontineSettingsOf(tontine: Tontine): TontineSettings {
  const { name, description, headerColors, contribution, frequency } = tontine;
  return { name, description, headerColors, contribution, frequency };
}

/**
 * Indique si les réglages changent la cotisation ou la fréquence.
 * @param tontine Tontine actuelle.
 * @param settings Réglages demandés.
 * @returns `true` quand une règle change.
 */
function changesRules(tontine: Tontine, settings: TontineSettings): boolean {
  const { unit, interval } = settings.frequency;
  return (
    settings.contribution !== tontine.contribution ||
    unit !== tontine.frequency.unit ||
    interval !== tontine.frequency.interval
  );
}

/**
 * Applique les réglages de l'administrateur. Le nom et la couleur changent à
 * tout moment ; la cotisation et la fréquence seulement avant le lancement,
 * car les membres se sont engagés sur ces règles.
 * @param tontine Tontine à régler.
 * @param settings Réglages demandés, déjà validés.
 * @returns La tontine réglée.
 * @throws {ForbiddenOperationError} si le membre connecté n'administre pas la tontine.
 * @throws {ForbiddenOperationError} si une règle change sur une tontine lancée.
 */
export function applyTontineSettings(tontine: Tontine, settings: TontineSettings): Tontine {
  requireAdmin(tontine);
  if (tontine.state !== "PENDING" && changesRules(tontine, settings)) {
    throw new ForbiddenOperationError("Les règles d'une tontine lancée ne changent plus.");
  }
  return { ...tontine, ...settings };
}
