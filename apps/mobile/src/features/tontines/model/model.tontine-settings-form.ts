import { z } from "zod";
import { tontineRulesLocked } from "../../../shared/member/model.tontine-contributions";

import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import type { TontineSettings } from "../../../shared/member/model.tontine-settings";
import { TONTINE_TINTS } from "../../../shared/member/model.tontine-settings";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formError, formOk } from "../../../shared/model/model.form-result";
import { amountSchema, nameSchema, parseWithSchema } from "../../../shared/model/model.form-schema";
import { frequencyById } from "../../../shared/model/model.frequency";

/** Saisie des réglages d'une tontine. */
export interface TontineSettingsForm {
  readonly name: string;
  /** Cotisation saisie au clavier, en FCFA. */
  readonly contribution: string;
  /** Identifiant de la fréquence, par exemple « mois-1 ». */
  readonly cadence: string;
  /** Rang du dégradé choisi dans {@link TONTINE_TINTS}. */
  readonly tint: number;
}

/** Schéma du nom et de la cotisation. */
const SETTINGS_SCHEMA = z.object({
  name: nameSchema("Donnez un nom à la tontine."),
  contribution: amountSchema("Saisissez une cotisation valide en FCFA."),
});

/**
 * Indique si les règles (cotisation, fréquence) sont figées : elles le sont
 * dès le lancement ou le premier versement, les membres s'étant engagés sur elles.
 * @param tontine Tontine réglée.
 * @returns `true` quand seuls le nom et la couleur se modifient.
 */
export function rulesLocked(tontine: Tontine): boolean {
  return tontineRulesLocked(tontine);
}

/**
 * Formulaire prérempli avec les réglages actuels de la tontine.
 * @param tontine Tontine réglée.
 * @returns La saisie de départ.
 */
export function settingsFormOf(tontine: Tontine): TontineSettingsForm {
  const tint = TONTINE_TINTS.findIndex(([main]) => main === tontine.headerColors[0]);
  return {
    name: tontine.name,
    contribution: tontine.contribution.toString(),
    cadence: `${tontine.frequency.unit}-${tontine.frequency.interval}`,
    tint: Math.max(tint, 0),
  };
}

/**
 * Valide la saisie et la convertit en réglages, description comprise.
 * @param form Saisie de l'administrateur.
 * @returns Les réglages, ou le message de la première erreur.
 */
export function parseTontineSettings(form: TontineSettingsForm): FormResult<TontineSettings> {
  const parsed = parseWithSchema(SETTINGS_SCHEMA, form);
  if (!parsed.ok) return parsed;
  const frequency = frequencyById(form.cadence);
  const headerColors = TONTINE_TINTS[form.tint];
  if (frequency === undefined || headerColors === undefined) {
    return formError("Choisissez une fréquence et une couleur dans la liste.");
  }
  const { name, contribution } = parsed.value;
  const description = `${name} : cotisation de ${formatAmount(contribution)} FCFA, ${formatFrequency(frequency)}.`;
  return formOk({ name, description, headerColors, contribution, frequency });
}
