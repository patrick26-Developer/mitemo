import { z } from "zod";

import { formatAmount } from "../../../shared/format/format.amount";
import type { TontineFrequency } from "../../../shared/member/model.portfolio";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import type { CreateTontineInput } from "../../../shared/member/model.portfolio-create";
import { parseAmountInput } from "../../../shared/model/model.amount-input";
import { parseCountInput } from "../../../shared/model/model.count-input";
import {
  amountSchema,
  countSchema,
  nameSchema,
  parseWithSchema,
} from "../../../shared/model/model.form-schema";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formOk } from "../../../shared/model/model.form-result";
import { stepError } from "../../../shared/model/model.form-steps";

/**
 * Fréquences proposées à la création, du plus court au plus long : le membre
 * choisit dans une liste au lieu de saisir une unité et un intervalle.
 */
export const TONTINE_CADENCES = [
  { id: "jour-1", unit: "jour", interval: 1 },
  { id: "jour-2", unit: "jour", interval: 2 },
  { id: "jour-3", unit: "jour", interval: 3 },
  { id: "semaine-1", unit: "semaine", interval: 1 },
  { id: "semaine-2", unit: "semaine", interval: 2 },
  { id: "mois-1", unit: "mois", interval: 1 },
  { id: "mois-2", unit: "mois", interval: 2 },
  { id: "mois-3", unit: "mois", interval: 3 },
] as const satisfies readonly (TontineFrequency & { readonly id: string })[];

/** Identifiant d'une fréquence proposée. Voir {@link TONTINE_CADENCES}. */
export type TontineCadenceId = (typeof TONTINE_CADENCES)[number]["id"];

/** Identifiants des fréquences proposées, dans l'ordre de la liste. */
const CADENCE_IDS = TONTINE_CADENCES.map((cadence) => cadence.id) as [
  TontineCadenceId,
  ...TontineCadenceId[],
];

/**
 * Met une majuscule au début d'un libellé.
 * @param label Libellé en minuscules.
 * @returns Le libellé, première lettre en capitale.
 */
function capitalize(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Options de la liste des fréquences, libellées en toutes lettres. */
export const TONTINE_CADENCE_OPTIONS: readonly { value: TontineCadenceId; label: string }[] =
  TONTINE_CADENCES.map((cadence) => ({
    value: cadence.id,
    label: capitalize(formatFrequency(cadence)),
  }));

/** Titres des étapes de la création, dans l'ordre. */
export const TONTINE_FORM_STEPS = ["L'essentiel", "La fréquence", "Les participants"] as const;

/** Champs saisis pour créer une tontine. */
export interface TontineFormState {
  readonly name: string;
  readonly contribution: string;
  /** Fréquence choisie dans la liste. Voir {@link TONTINE_CADENCES}. */
  readonly cadence: TontineCadenceId;
  readonly participants: string;
  readonly rounds: string;
}

/** Récapitulatif d'une tontine en cours de saisie. */
export interface TontineRecap {
  /** Cagnotte d'un tour, `null` tant que la cotisation ou les participants manquent. */
  readonly pot: bigint | null;
  /** Fréquence complète, `null` quand l'intervalle est invalide. */
  readonly frequency: TontineFrequency | null;
}

/** Nombre maximal de participants à une tontine créée depuis le mobile. */
const MAX_PARTICIPANTS = 50;

/** Nombre maximal de tours d'une tontine créée depuis le mobile. */
const MAX_ROUNDS = 100;

/** Nombre maximal d'unités entre deux tours. */
/** Message affiché quand les tours ne couvrent pas tous les participants. */
const ROUNDS_PER_PARTICIPANT_ERROR = "Prévoyez au moins un tour par participant.";

/** Formulaire proposé à l'ouverture de la feuille de création. */
export const INITIAL_TONTINE_FORM: TontineFormState = {
  name: "",
  contribution: "",
  cadence: "semaine-1",
  participants: "6",
  rounds: "10",
};

/**
 * Schéma de saisie d'une tontine : chaque participant reçoit la cagnotte au
 * moins une fois, donc le nombre de tours ne peut pas être inférieur au
 * nombre de participants.
 */
const essentialsSchema = z.object({
  name: nameSchema("Donnez un nom à la tontine."),
  contribution: amountSchema("Saisissez une cotisation valide en FCFA."),
});

const cadenceSchema = z.object({
  cadence: z.enum(CADENCE_IDS, { error: "Choisissez une fréquence dans la liste." }),
});

/** Schémas des étapes intermédiaires ; la dernière valide tout le formulaire. */
const STEP_SCHEMAS = [essentialsSchema, cadenceSchema] as const;

const tontineFormSchema = essentialsSchema
  .extend(cadenceSchema.shape)
  .extend({
    participants: countSchema({
      min: 2,
      max: MAX_PARTICIPANTS,
      message: "Indiquez entre 2 et 50 participants.",
    }),
    rounds: countSchema({
      min: 1,
      max: MAX_ROUNDS,
      message: "Indiquez entre 1 et 100 tours.",
    }),
  })
  .superRefine((form, ctx) => {
    if (form.rounds < form.participants) {
      ctx.addIssue({ code: "custom", message: ROUNDS_PER_PARTICIPANT_ERROR });
    }
  });

/**
 * Valide la saisie et construit la tontine correspondante.
 * @param form Champs saisis.
 * @returns L'entrée acceptée, ou le message à corriger.
 */
export function parseTontineForm(form: TontineFormState): FormResult<CreateTontineInput> {
  const parsed = parseWithSchema(tontineFormSchema, form);
  if (!parsed.ok) return parsed;

  const { name, contribution, cadence, participants, rounds } = parsed.value;
  const cycle = cadenceOf(cadence) ?? TONTINE_CADENCES[3];

  return formOk({
    name,
    contribution,
    frequency: cycle,
    totalRounds: rounds,
    participantCount: participants,
    description: `${name} : cotisation de ${formatAmount(contribution)} FCFA, ${formatFrequency(cycle)}.`,
  });
}

/**
 * Résume la cagnotte d'un tour et la fréquence d'une tontine en cours de saisie.
 * @param form Champs saisis.
 * @returns Les valeurs affichables, incomplètes tant que la saisie l'est.
 */
export function tontineRecap(form: TontineFormState): TontineRecap {
  const contribution = parseAmountInput(form.contribution);
  const participants = parseCountInput(form.participants, MAX_PARTICIPANTS);
  const pot =
    contribution !== null && participants !== null && participants >= 2
      ? contribution * BigInt(participants - 1)
      : null;
  const cadence = cadenceOf(form.cadence);
  const frequency =
    cadence === undefined ? null : { unit: cadence.unit, interval: cadence.interval };

  return { pot, frequency };
}

/**
 * Retrouve une fréquence de la liste par son identifiant.
 * @param id Identifiant choisi.
 * @returns La fréquence, ou `undefined` si l'identifiant est inconnu.
 */
function cadenceOf(id: string): TontineFrequency | undefined {
  const cadence = TONTINE_CADENCES.find((entry) => entry.id === id);

  return cadence === undefined ? undefined : { unit: cadence.unit, interval: cadence.interval };
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
