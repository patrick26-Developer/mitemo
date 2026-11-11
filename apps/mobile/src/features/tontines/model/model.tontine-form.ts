import { z } from "zod";

import { formatAmount } from "../../../shared/format/format.amount";
import type { TontineFrequency } from "../../../shared/member/model.portfolio";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import type { CreateTontineInput } from "../../../shared/member/model.portfolio-create";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formOk } from "../../../shared/model/model.form-result";
import { stepError } from "../../../shared/model/model.form-steps";
import { parseAmountInput } from "../../../shared/model/model.amount-input";
import {
  amountSchema,
  isValidNameInput,
  nameSchema,
  parseWithSchema,
} from "../../../shared/model/model.form-schema";
import { FREQUENCY_GROUPS, frequencyById } from "../../../shared/model/model.frequency";

/**
 * Fréquences proposées à la création, groupées par unité : le membre choisit
 * « tous les 2 jours » au lieu de saisir une unité et un intervalle.
 */
export const TONTINE_CADENCE_GROUPS = FREQUENCY_GROUPS.map((group) => ({
  title: group.title,
  options: group.options.map((option) => ({ value: option.id, label: option.label })),
}));

/** Identifiant d'une fréquence proposée, par exemple « semaine-2 ». */
export type TontineCadenceId = string;

/** Titres des étapes de la création, dans l'ordre. */
export const TONTINE_FORM_STEPS = [
  "L'essentiel",
  "La fréquence",
  "Les participants",
  "Le récapitulatif",
] as const;

/** Champs saisis pour créer une tontine. */
export interface TontineFormState {
  readonly name: string;
  readonly contribution: string;
  /** Fréquence choisie dans la liste. Voir {@link TONTINE_CADENCE_GROUPS}. */
  readonly cadence: TontineCadenceId;
  /** Participants, membre connecté inclus. */
  readonly participants: number;
}

/** Récapitulatif d'une tontine en cours de saisie. */
export interface TontineRecap {
  /** Cotisation versée à chaque tour, `null` tant que la saisie manque. */
  readonly contribution: bigint | null;
  /** Participants du cycle, `null` tant que la saisie manque. */
  readonly participants: number | null;
  /** Cagnotte remise à un bénéficiaire, `null` tant que la saisie manque. */
  readonly pot: bigint | null;
  /** Fréquence complète, `null` quand l'identifiant est inconnu. */
  readonly frequency: TontineFrequency | null;
  /** Tours du cycle : un par participant. */
  readonly rounds: number | null;
  /** Total versé par un membre sur tout le cycle. */
  readonly cycleTotal: bigint | null;
}

/** Champs à signaler en rouge après une validation refusée. */
export interface TontineInvalidFields {
  readonly name: boolean;
  readonly contribution: boolean;
  readonly participants: boolean;
}

/** Nombre minimal de participants à une tontine. */
const MIN_PARTICIPANTS = 2;

/** Nombre maximal de participants à une tontine créée depuis le mobile. */
const MAX_PARTICIPANTS = 50;

/** Message affiché quand le nombre de participants sort des bornes. */
const PARTICIPANTS_ERROR = "Indiquez entre 2 et 50 participants.";

/** Message affiché quand la fréquence ne vient pas de la liste. */
const CADENCE_ERROR = "Choisissez une fréquence dans la liste.";

/** Formulaire proposé à l'ouverture de la feuille de création. */
export const INITIAL_TONTINE_FORM: TontineFormState = {
  name: "",
  contribution: "",
  cadence: "semaine-1",
  participants: 6,
};

/** Nom et cotisation, communs à la première étape et au formulaire complet. */
const essentialsSchema = z.object({
  name: nameSchema("Donnez un nom à la tontine."),
  contribution: amountSchema("Saisissez une cotisation valide en FCFA."),
});

const cadenceSchema = z.object({
  cadence: z.string().refine((id) => frequencyById(id) !== undefined, { error: CADENCE_ERROR }),
});

const participantsSchema = z.object({
  participants: z
    .number({ error: PARTICIPANTS_ERROR })
    .int(PARTICIPANTS_ERROR)
    .min(MIN_PARTICIPANTS, { error: PARTICIPANTS_ERROR })
    .max(MAX_PARTICIPANTS, { error: PARTICIPANTS_ERROR }),
});

/** Schémas des étapes intermédiaires ; la dernière valide tout le formulaire. */
const STEP_SCHEMAS = [essentialsSchema, cadenceSchema, participantsSchema] as const;

const tontineFormSchema = essentialsSchema
  .extend(cadenceSchema.shape)
  .extend(participantsSchema.shape);

/** Totaux d'un cycle, calculés quand la cotisation et les participants tiennent. */
interface CycleTotals {
  readonly contribution: bigint;
  readonly participants: number;
  readonly pot: bigint;
  readonly cycleTotal: bigint;
}

/**
 * Calcule les totaux du cycle d'une tontine.
 * @param form Champs saisis.
 * @returns Les totaux, ou `null` tant que la cotisation ou les participants manquent.
 */
function cycleTotals(form: TontineFormState): CycleTotals | null {
  const contribution = parseAmountInput(form.contribution);
  if (contribution === null || !Number.isInteger(form.participants)) return null;
  if (form.participants < MIN_PARTICIPANTS) return null;

  return {
    contribution,
    participants: form.participants,
    pot: contribution * BigInt(form.participants - 1),
    cycleTotal: contribution * BigInt(form.participants),
  };
}

/**
 * Résume la cagnotte, la fréquence et les tours d'une tontine en cours de
 * saisie. Chaque participant prend un tour : le cycle dure autant de tours que
 * de participants.
 * @param form Champs saisis.
 * @returns Les valeurs affichables, incomplètes tant que la saisie l'est.
 */
export function tontineRecap(form: TontineFormState): TontineRecap {
  const frequency = frequencyById(form.cadence) ?? null;
  const totals = cycleTotals(form);

  if (totals === null) {
    return {
      contribution: null,
      participants: null,
      pot: null,
      frequency,
      rounds: null,
      cycleTotal: null,
    };
  }

  return { ...totals, frequency, rounds: totals.participants };
}

/**
 * Valide la saisie et construit la tontine correspondante.
 * @param form Champs saisis.
 * @returns L'entrée acceptée, ou le message à corriger.
 */
export function parseTontineForm(form: TontineFormState): FormResult<CreateTontineInput> {
  const parsed = parseWithSchema(tontineFormSchema, form);
  if (!parsed.ok) return parsed;

  const { name, contribution, cadence, participants } = parsed.value;
  const cycle = frequencyById(cadence);
  if (cycle === undefined) return { ok: false, message: CADENCE_ERROR };

  return formOk({
    name,
    contribution,
    frequency: cycle,
    participantCount: participants,
    description: `${name} : cotisation de ${formatAmount(contribution)} FCFA, ${formatFrequency(cycle)}.`,
  });
}

/**
 * Repère les champs d'une tontine qui ne respectent pas leur règle.
 * @param form Champs saisis.
 * @returns Vrai pour chaque champ à signaler en rouge.
 */
export function tontineInvalidFields(form: TontineFormState): TontineInvalidFields {
  const participantsOk =
    Number.isInteger(form.participants) &&
    form.participants >= MIN_PARTICIPANTS &&
    form.participants <= MAX_PARTICIPANTS;

  return {
    name: !isValidNameInput(form.name),
    contribution: parseAmountInput(form.contribution) === null,
    participants: !participantsOk,
  };
}

/**
 * Valide une étape de la création avant de passer à la suivante. La dernière
 * étape valide tout le formulaire.
 * @param form Saisie courante.
 * @param step Étape à valider, à partir de 0.
 * @returns Le message de la première erreur, ou `null` si l'étape est valide.
 */
export function tontineStepError(form: TontineFormState, step: number): string | null {
  return stepError(STEP_SCHEMAS[step] ?? tontineFormSchema, form);
}
