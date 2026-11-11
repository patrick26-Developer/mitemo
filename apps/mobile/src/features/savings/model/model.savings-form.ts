import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { CreateCardInput } from "../../../shared/member/model.portfolio-create";
import { parseAmountInput } from "../../../shared/model/model.amount-input";
import { parseCountInput } from "../../../shared/model/model.count-input";
import { parseIsoDateInput } from "../../../shared/model/model.date-input";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formError, formOk } from "../../../shared/model/model.form-result";

/** Champs saisis pour créer une carte de pointage. */
export interface SavingsFormState {
  readonly name: string;
  readonly markerAmount: string;
  readonly markersTotal: string;
  readonly deadline: string;
  /** Tontine rattachée, `null` quand la carte reste indépendante. */
  readonly tontineId: string | null;
}

/** Nombre maximal de marqueurs d'une carte créée depuis le mobile. */
const MAX_MARKERS = 100;

/** Formulaire proposé à l'ouverture de la feuille de création. */
export const INITIAL_SAVINGS_FORM: SavingsFormState = {
  name: "",
  markerAmount: "",
  markersTotal: "10",
  deadline: "",
  tontineId: null,
};

/**
 * Valide la saisie et construit la carte correspondante.
 * @param form Champs saisis.
 * @returns L'entrée acceptée, ou le message à corriger.
 */
export function parseSavingsForm(form: SavingsFormState): FormResult<CreateCardInput> {
  const name = form.name.trim();
  const markerAmount = parseAmountInput(form.markerAmount);
  const markersTotal = parseCountInput(form.markersTotal, MAX_MARKERS);
  const deadline = parseIsoDateInput(form.deadline);

  if (name === "") return formError("Donnez un nom à la carte.");
  if (markerAmount === null) return formError("Saisissez le montant d'un marqueur en FCFA.");
  if (markersTotal === null) return formError("Indiquez entre 1 et 100 marqueurs.");
  if (deadline === null) return formError("Saisissez une échéance au format AAAA-MM-JJ.");

  return formOk({
    name,
    markerAmount,
    markersTotal,
    deadline,
    tontineId: form.tontineId,
    description: `${name} : ${markersTotal} marqueurs de ${formatAmount(markerAmount)} FCFA, échéance le ${formatLongDate(deadline)}.`,
  });
}
