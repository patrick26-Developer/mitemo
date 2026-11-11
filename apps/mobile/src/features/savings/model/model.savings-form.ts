import { z } from "zod";

import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { TontineFrequency } from "../../../shared/member/model.portfolio";
import type { CreateCardInput } from "../../../shared/member/model.portfolio-create";
import { parseAmountInput } from "../../../shared/model/model.amount-input";
import { todayUtc } from "../../../shared/model/model.clock";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formOk } from "../../../shared/model/model.form-result";
import {
  isValidNameInput,
  nameSchema,
  parseWithSchema,
} from "../../../shared/model/model.form-schema";
import { stepError } from "../../../shared/model/model.form-steps";
import { frequencyById } from "../../../shared/model/model.frequency";
import { markersForPlan } from "../../../shared/model/model.markers";

/** Champs saisis pour créer une carte de pointage. */
export interface SavingsFormState {
  readonly name: string;
  /** Objectif d'épargne, en francs CFA saisis. */
  readonly goal: string;
  /** Montant proposé à chaque pointage, en francs CFA saisis. */
  readonly markerAmount: string;
  /** Fréquence des pointages, choisie dans la liste. */
  readonly cadence: string;
  /** Échéance choisie au calendrier, en ISO 8601 UTC, ou chaîne vide. */
  readonly deadline: string;
  /** Tontine rattachée, `null` quand la carte reste indépendante. */
  readonly tontineId: string | null;
}

/** Récapitulatif d'une carte en cours de saisie. */
export interface SavingsRecap {
  /** Objectif total, `null` tant que la saisie manque. */
  readonly goal: bigint | null;
  /** Montant proposé par pointage, `null` tant que la saisie manque. */
  readonly markerAmount: bigint | null;
  /** Rythme des pointages, `null` quand la fréquence est inconnue. */
  readonly frequency: TontineFrequency | null;
  /** Nombre de marqueurs déduit du rythme et de l'échéance. */
  readonly markers: number | null;
  /** Échéance au format ISO, `null` quand aucune date n'est choisie. */
  readonly deadline: string | null;
}

/** Champs à signaler en rouge après une validation refusée. */
export interface SavingsInvalidFields {
  readonly name: boolean;
  readonly goal: boolean;
  readonly markerAmount: boolean;
  readonly deadline: boolean;
}

/** Titres des étapes de la création d'une carte, dans l'ordre de saisie. */
export const SAVINGS_FORM_STEPS = ["Le projet", "Le rythme"] as const;

/** Formulaire proposé à l'ouverture de la feuille de création. */
export const INITIAL_SAVINGS_FORM: SavingsFormState = {
  name: "",
  goal: "",
  markerAmount: "",
  cadence: "semaine-1",
  deadline: "",
  tontineId: null,
};

/** Message affiché quand aucune échéance n'est choisie. */
const DEADLINE_MISSING_ERROR = "Choisissez une date d'échéance.";

/** Message affiché quand l'échéance n'est pas postérieure au jour courant. */
const DEADLINE_PAST_ERROR = "Choisissez une échéance postérieure à aujourd'hui.";

/** Message affiché quand la fréquence ne vient pas de la liste. */
const CADENCE_ERROR = "Choisissez une fréquence dans la liste.";

/** Jour ISO 8601 UTC, par exemple « 2026-12-31 ». */
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Indique si un texte est un jour ISO 8601 UTC.
 * @param text Texte à vérifier.
 * @returns Vrai pour une date au format `AAAA-MM-JJ`.
 */
function isIsoDay(text: string): boolean {
  return ISO_DAY.test(text);
}

/** Nom et montants de la carte, communs à la première étape et au formulaire. */
const projectSchema = z.object({
  name: nameSchema("Donnez un nom à la carte."),
  goal: z.string().transform((text, ctx) => {
    const goal = parseAmountInput(text);
    if (goal === null) {
      ctx.addIssue("Saisissez un objectif en FCFA.");
      return z.NEVER;
    }
    return goal;
  }),
  markerAmount: z.string().transform((text, ctx) => {
    const markerAmount = parseAmountInput(text);
    if (markerAmount === null) {
      ctx.addIssue("Saisissez le montant proposé par pointage en FCFA.");
      return z.NEVER;
    }
    return markerAmount;
  }),
});

/**
 * Construit le schéma du rythme : fréquence de la liste et échéance à venir.
 * @param now Instant de référence, injecté pour rendre la règle testable.
 * @returns Le schéma de la deuxième étape.
 */
function rhythmSchema(now: Date) {
  const today = todayUtc(now);

  return z.object({
    cadence: z.string().refine((id) => frequencyById(id) !== undefined, { error: CADENCE_ERROR }),
    deadline: z
      .string()
      .refine(isIsoDay, { error: DEADLINE_MISSING_ERROR })
      .refine((deadline) => deadline > today, { error: DEADLINE_PAST_ERROR }),
    tontineId: z.string().nullable(),
  });
}

/**
 * Valide une étape de la saisie : la première ne contrôle que le projet, la
 * dernière contrôle tout le formulaire.
 * @param form Champs saisis.
 * @param step Indice de l'étape, à partir de 0.
 * @param now Instant de référence de la règle d'échéance.
 * @returns Le message à corriger, ou `null` si l'étape est valide.
 */
export function savingsStepError(form: SavingsFormState, step: number, now: Date): string | null {
  return stepError(
    step === 0 ? projectSchema : projectSchema.extend(rhythmSchema(now).shape),
    form,
  );
}

/**
 * Valide la saisie et construit la carte correspondante. Le nombre de
 * marqueurs découle du rythme, de la date de création et de l'échéance.
 * @param form Champs saisis.
 * @param now Instant de référence, injecté pour rendre la règle testable.
 * @returns L'entrée acceptée, ou le message à corriger.
 */
export function parseSavingsForm(form: SavingsFormState, now: Date): FormResult<CreateCardInput> {
  const parsed = parseWithSchema(projectSchema.extend(rhythmSchema(now).shape), form);
  if (!parsed.ok) return parsed;

  const { name, goal, markerAmount, cadence, deadline, tontineId } = parsed.value;
  const frequency = frequencyById(cadence);
  if (frequency === undefined) return { ok: false, message: CADENCE_ERROR };
  const startDate = todayUtc(now);
  const markersTotal = markersForPlan({ frequency, start: startDate, deadline });

  return formOk({
    name,
    goal,
    markerAmount,
    markersTotal,
    frequency,
    startDate,
    deadline,
    tontineId,
    description: `${name} : ${formatAmount(goal)} FCFA en ${markersTotal} pointages de ${formatAmount(markerAmount)} FCFA, échéance le ${formatLongDate(deadline)}.`,
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
    goal: parseAmountInput(form.goal) === null,
    markerAmount: parseAmountInput(form.markerAmount) === null,
    deadline: !isIsoDay(form.deadline),
  };
}

/**
 * Résume l'objectif, le rythme et le nombre de pointages d'une carte en cours
 * de saisie.
 * @param form Champs saisis.
 * @param now Instant de référence, injecté pour rendre le calcul testable.
 * @returns Les valeurs affichables, incomplètes tant que la saisie l'est.
 */
export function savingsRecap(form: SavingsFormState, now: Date): SavingsRecap {
  const frequency = frequencyById(form.cadence) ?? null;
  const deadline = isIsoDay(form.deadline) ? form.deadline : null;
  const complete =
    frequency !== null && deadline !== null && deadline > todayUtc(now)
      ? markersForPlan({ frequency, start: todayUtc(now), deadline })
      : null;

  return {
    goal: parseAmountInput(form.goal),
    markerAmount: parseAmountInput(form.markerAmount),
    frequency,
    markers: complete,
    deadline,
  };
}
