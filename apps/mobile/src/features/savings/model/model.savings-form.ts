import { z } from "zod";

import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { CreateCardInput } from "../../../shared/member/model.portfolio-create";
import { parseAmountInput } from "../../../shared/model/model.amount-input";
import { parseCountInput } from "../../../shared/model/model.count-input";
import { parseFrenchDateInput } from "../../../shared/model/model.date-input";
import {
  amountSchema,
  countSchema,
  isValidNameInput,
  nameSchema,
  parseWithSchema,
} from "../../../shared/model/model.form-schema";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formOk } from "../../../shared/model/model.form-result";
import { stepError } from "../../../shared/model/model.form-steps";

/** Champs saisis pour créer une carte de pointage. */
export interface SavingsFormState {
  readonly name: string;
  readonly markerAmount: string;
  readonly markersTotal: string;
  /** Échéance saisie au format JJ/MM/AAAA. */
  readonly deadline: string;
  /** Tontine rattachée, `null` quand la carte reste indépendante. */
  readonly tontineId: string | null;
}

/** Récapitulatif d'une carte en cours de saisie. */
export interface SavingsRecap {
  /** Objectif total, `null` tant que le montant ou le nombre de marqueurs manquent. */
  readonly goal: bigint | null;
  /** Échéance au format ISO, `null` quand la date saisie est invalide. */
  readonly deadline: string | null;
}

/** Champs à signaler en rouge après une validation refusée. */
export interface SavingsInvalidFields {
  readonly name: boolean;
  readonly markerAmount: boolean;
  readonly markersTotal: boolean;
  readonly deadline: boolean;
}

/** Nombre maximal de marqueurs d'une carte créée depuis le mobile. */
const MAX_MARKERS = 100;

/** Message affiché quand l'échéance n'est pas une date française valide. */
const DEADLINE_FORMAT_ERROR = "Saisissez une échéance au format JJ/MM/AAAA.";

/** Message affiché quand l'échéance n'est pas postérieure au jour courant. */
const DEADLINE_PAST_ERROR = "Choisissez une échéance postérieure à aujourd'hui.";

/** Titres des étapes de la création d'une carte, dans l'ordre de saisie. */
export const SAVINGS_FORM_STEPS = ["La carte", "L'échéance"] as const;

/** Schéma de la première étape : le nom et les marqueurs de la carte. */
const cardSchema = z.object({
  name: nameSchema("Donnez un nom à la carte."),
  markerAmount: amountSchema("Saisissez le montant d'un marqueur en FCFA."),
  markersTotal: countSchema({
    min: 1,
    max: MAX_MARKERS,
    message: "Indiquez entre 1 et 100 marqueurs.",
  }),
});

/** Formulaire proposé à l'ouverture de la feuille de création. */
export const INITIAL_SAVINGS_FORM: SavingsFormState = {
  name: "",
  markerAmount: "",
  markersTotal: "10",
  deadline: "",
  tontineId: null,
};

/**
 * Construit le schéma d'une échéance : date française valide et strictement
 * postérieure au jour de l'instant de référence.
 * @param now Instant de référence, injecté pour rendre la règle testable.
 * @returns Le schéma du champ, qui rend la date ISO de l'échéance.
 */
function deadlineSchema(now: Date) {
  const today = now.toISOString().slice(0, 10);

  return z.string().transform((text, ctx) => {
    const deadline = parseFrenchDateInput(text);

    if (deadline === null) {
      ctx.addIssue(DEADLINE_FORMAT_ERROR);
      return z.NEVER;
    }

    if (deadline <= today) {
      ctx.addIssue(DEADLINE_PAST_ERROR);
      return z.NEVER;
    }

    return deadline;
  });
}

/**
 * Construit le schéma de saisie d'une carte de pointage.
 * @param now Instant de référence de la règle d'échéance.
 * @returns Le schéma du formulaire.
 */
function savingsFormSchema(now: Date) {
  return cardSchema.extend({
    deadline: deadlineSchema(now),
    tontineId: z.string().nullable(),
  });
}

/**
 * Valide une étape de la saisie : la première ne contrôle que la carte, la
 * dernière contrôle tout le formulaire.
 * @param form Champs saisis.
 * @param step Indice de l'étape, à partir de 0.
 * @param now Instant de référence de la règle d'échéance.
 * @returns Le message à corriger, ou `null` si l'étape est valide.
 */
export function savingsStepError(form: SavingsFormState, step: number, now: Date): string | null {
  return stepError(step === 0 ? cardSchema : savingsFormSchema(now), form);
}

/**
 * Valide la saisie et construit la carte correspondante.
 * @param form Champs saisis.
 * @param now Instant de référence, injecté pour rendre la règle testable.
 * @returns L'entrée acceptée, ou le message à corriger.
 */
export function parseSavingsForm(form: SavingsFormState, now: Date): FormResult<CreateCardInput> {
  const parsed = parseWithSchema(savingsFormSchema(now), form);
  if (!parsed.ok) return parsed;

  const { name, markerAmount, markersTotal, deadline, tontineId } = parsed.value;

  return formOk({
    name,
    markerAmount,
    markersTotal,
    deadline,
    tontineId,
    description: `${name} : ${markersTotal} marqueurs de ${formatAmount(markerAmount)} FCFA, échéance le ${formatLongDate(deadline)}.`,
  });
}

/**
 * Repère les champs d'une carte qui ne respectent pas leur règle.
 * @param form Champs saisis.
 * @returns Vrai pour chaque champ à signaler en rouge.
 */
export function savingsInvalidFields(form: SavingsFormState): SavingsInvalidFields {
  return {
    name: !isValidNameInput(form.name),
    markerAmount: parseAmountInput(form.markerAmount) === null,
    markersTotal: parseCountInput(form.markersTotal, MAX_MARKERS) === null,
    deadline: parseFrenchDateInput(form.deadline) === null,
  };
}

/**
 * Résume l'objectif et l'échéance d'une carte en cours de saisie.
 * @param form Champs saisis.
 * @returns Les valeurs affichables, incomplètes tant que la saisie l'est.
 */
export function savingsRecap(form: SavingsFormState): SavingsRecap {
  const markerAmount = parseAmountInput(form.markerAmount);
  const markersTotal = parseCountInput(form.markersTotal, MAX_MARKERS);
  const goal =
    markerAmount !== null && markersTotal !== null ? markerAmount * BigInt(markersTotal) : null;

  return { goal, deadline: parseFrenchDateInput(form.deadline) };
}
