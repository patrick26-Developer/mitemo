import type { CycleFrequencyUnit } from "@mitemo/contracts";

import { formatAmount } from "../../../shared/format/format.amount";
import type { TontineFrequency } from "../../../shared/member/model.portfolio";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import type { CreateTontineInput } from "../../../shared/member/model.portfolio-create";
import { parseAmountInput } from "../../../shared/model/model.amount-input";
import { parseCountInput } from "../../../shared/model/model.count-input";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formError, formOk } from "../../../shared/model/model.form-result";

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

/** Formulaire proposé à l'ouverture de la feuille de création. */
export const INITIAL_TONTINE_FORM: TontineFormState = {
  name: "",
  contribution: "",
  frequency: "semaine",
  interval: "1",
  participants: "6",
  rounds: "10",
};

/** Valeurs numériques validées du formulaire de tontine. */
interface TontineNumbers {
  readonly contribution: bigint;
  readonly interval: number;
  readonly participants: number;
  readonly totalRounds: number;
}

/**
 * Lit et valide les nombres saisis dans le formulaire de tontine.
 * @param form Champs saisis.
 * @returns Les valeurs acceptées, ou le message à corriger.
 */
function readTontineNumbers(form: TontineFormState): FormResult<TontineNumbers> {
  const contribution = parseAmountInput(form.contribution);
  const interval = parseCountInput(form.interval, MAX_INTERVAL);
  const participants = parseCountInput(form.participants, MAX_PARTICIPANTS);
  const totalRounds = parseCountInput(form.rounds, MAX_ROUNDS);

  if (contribution === null) return formError("Saisissez une cotisation valide en FCFA.");
  if (interval === null) return formError("Indiquez un intervalle entre 1 et 12.");
  if (participants === null || participants < 2) {
    return formError("Indiquez entre 2 et 50 participants.");
  }
  if (totalRounds === null) return formError("Indiquez entre 1 et 100 tours.");

  return formOk({ contribution, interval, participants, totalRounds });
}

/**
 * Valide la saisie et construit la tontine correspondante.
 * @param form Champs saisis.
 * @returns L'entrée acceptée, ou le message à corriger.
 */
export function parseTontineForm(form: TontineFormState): FormResult<CreateTontineInput> {
  const name = form.name.trim();
  if (name === "") return formError("Donnez un nom à la tontine.");
  const numbers = readTontineNumbers(form);
  if (!numbers.ok) return numbers;

  const { contribution, interval, participants, totalRounds } = numbers.value;
  const frequency: TontineFrequency = { unit: form.frequency, interval };

  return formOk({
    name,
    contribution,
    frequency,
    totalRounds,
    participantCount: participants,
    description: `${name} : cotisation de ${formatAmount(contribution)} FCFA, ${formatFrequency(frequency)}.`,
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
