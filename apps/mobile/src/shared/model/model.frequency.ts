import type { TontineFrequency } from "../member/model.portfolio";
import { formatFrequency } from "../member/model.portfolio";

/** Fréquence proposée dans un formulaire, avec son libellé en toutes lettres. */
export interface FrequencyOption {
  /** Identifiant stable, par exemple « semaine-2 ». */
  readonly id: string;
  readonly label: string;
  readonly frequency: TontineFrequency;
}

/** Groupe de fréquences d'une même unité, pour un sélecteur lisible. */
export interface FrequencyGroup {
  readonly title: string;
  readonly options: readonly FrequencyOption[];
}

/** Unités proposées, leur intervalle maximal et le titre de leur groupe. */
const UNITS = [
  { unit: "jour", max: 7, title: "Au jour" },
  { unit: "semaine", max: 4, title: "À la semaine" },
  { unit: "mois", max: 12, title: "Au mois" },
] as const;

/**
 * Met une majuscule au début d'un libellé.
 * @param label Libellé en minuscules.
 * @returns Le libellé, première lettre en capitale.
 */
function capitalize(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Construit les fréquences d'une unité, de « chaque jour » à « tous les 7 jours ».
 * @param unit Unité du cycle.
 * @param max Intervalle maximal proposé.
 * @returns Les options de l'unité, dans l'ordre des intervalles.
 */
function unitOptions(unit: TontineFrequency["unit"], max: number): readonly FrequencyOption[] {
  return Array.from({ length: max }, (_, index) => {
    const interval = index + 1;
    const frequency = { unit, interval };

    return {
      id: `${unit}-${interval}`,
      label: capitalize(formatFrequency(frequency)),
      frequency,
    };
  });
}

/** Fréquences proposées, groupées par unité : jour, semaine puis mois. */
export const FREQUENCY_GROUPS: readonly FrequencyGroup[] = UNITS.map((entry) => ({
  title: entry.title,
  options: unitOptions(entry.unit, entry.max),
}));

/** Fréquences proposées, à plat, dans l'ordre des groupes. */
export const FREQUENCY_OPTIONS: readonly FrequencyOption[] = FREQUENCY_GROUPS.flatMap(
  (group) => group.options,
);

/**
 * Retrouve une fréquence proposée par son identifiant.
 * @param id Identifiant choisi, par exemple « mois-3 ».
 * @returns La fréquence, ou `undefined` si l'identifiant est inconnu.
 */
export function frequencyById(id: string): TontineFrequency | undefined {
  return FREQUENCY_OPTIONS.find((option) => option.id === id)?.frequency;
}

/**
 * Retrouve le libellé d'une fréquence proposée.
 * @param id Identifiant choisi.
 * @returns Le libellé, ou `undefined` si l'identifiant est inconnu.
 */
export function frequencyLabel(id: string): string | undefined {
  return FREQUENCY_OPTIONS.find((option) => option.id === id)?.label;
}
