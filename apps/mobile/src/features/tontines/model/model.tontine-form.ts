import { CYCLE_FREQUENCY_UNITS } from "@mitemo/contracts";
import type { CycleFrequencyUnit } from "@mitemo/contracts";
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

/** Champs saisis pour créer une tontine. */
export interface TontineFormState {
  readonly name: string;
  readonly contribution: string;
  readonly frequency: CycleFrequencyUnit;
  /** Nombre d'unités entre deux tours, par exemple 2 pour toutes les deux semaines. */
  readonly interval: string;
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
const MAX_INTERVAL = 12;

/** Message affiché quand les tours ne couvrent pas tous les participants. */
const ROUNDS_PER_PARTICIPANT_ERROR = "Prévoyez au moins un tour par participant.";

/** Formulaire proposé à l'ouverture de la feuille de création. */
export const INITIAL_TONTINE_FORM: TontineFormState = {
  name: "",
  contribution: "",
  frequency: "semaine",
  interval: "1",
  participants: "6",
  rounds: "10",
};

/**
 * Schéma de saisie d'une tontine : chaque participant reçoit la cagnotte au
 * moins une fois, donc le nombre de tours ne peut pas être inférieur au
 * nombre de participants.
 */
const tontineFormSchema = z
  .object({
    name: nameSchema("Donnez un nom à la tontine."),
    contribution: amountSchema("Saisissez une cotisation valide en FCFA."),
    frequency: z.enum(CYCLE_FREQUENCY_UNITS, { error: "Choisissez une fréquence valide." }),
    interval: countSchema({
      min: 1,
      max: MAX_INTERVAL,
      message: "Indiquez un intervalle entre 1 et 12.",
    }),
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

  const { name, contribution, frequency, interval, participants, rounds } = parsed.value;
  const cycle: TontineFrequency = { unit: frequency, interval };

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
  const interval = parseCountInput(form.interval, MAX_INTERVAL);
  const pot =
    contribution !== null && participants !== null && participants >= 2
      ? contribution * BigInt(participants - 1)
      : null;
  const frequency = interval === null ? null : { unit: form.frequency, interval };

  return { pot, frequency };
}
