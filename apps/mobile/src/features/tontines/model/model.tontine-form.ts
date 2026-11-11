import type { CycleFrequencyUnit } from "@mitemo/contracts";

import { formatAmount } from "../../../shared/format/format.amount";
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
  readonly participants: string;
  readonly rounds: string;
}

/** Nombre maximal de participants à une tontine créée depuis le mobile. */
const MAX_PARTICIPANTS = 50;

/** Nombre maximal de tours d'une tontine créée depuis le mobile. */
const MAX_ROUNDS = 100;

/** Formulaire proposé à l'ouverture de la feuille de création. */
export const INITIAL_TONTINE_FORM: TontineFormState = {
  name: "",
  contribution: "",
  frequency: "semaine",
  participants: "6",
  rounds: "10",
};

/**
 * Valide la saisie et construit la tontine correspondante.
 * @param form Champs saisis.
 * @returns L'entrée acceptée, ou le message à corriger.
 */
export function parseTontineForm(form: TontineFormState): FormResult<CreateTontineInput> {
  const name = form.name.trim();
  const contribution = parseAmountInput(form.contribution);
  const participants = parseCountInput(form.participants, MAX_PARTICIPANTS);
  const totalRounds = parseCountInput(form.rounds, MAX_ROUNDS);

  if (name === "") return formError("Donnez un nom à la tontine.");
  if (contribution === null) return formError("Saisissez une cotisation valide en FCFA.");
  if (participants === null || participants < 2) {
    return formError("Indiquez entre 2 et 50 participants.");
  }
  if (totalRounds === null) return formError("Indiquez entre 1 et 100 tours.");

  return formOk({
    name,
    contribution,
    frequency: { unit: form.frequency, interval: 1 },
    totalRounds,
    participantCount: participants,
    description: `${name} : cotisation de ${formatAmount(contribution)} FCFA, un tour par ${form.frequency}.`,
  });
}
