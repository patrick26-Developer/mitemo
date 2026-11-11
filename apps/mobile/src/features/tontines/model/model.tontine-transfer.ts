import { parseAmountInput } from "../../../shared/model/model.amount-input";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formError, formOk } from "../../../shared/model/model.form-result";

/**
 * Valide le destinataire et le montant d'un transfert vers un membre.
 * @param memberId Membre choisi, chaîne vide quand aucun n'est sélectionné.
 * @param amount Texte saisi au clavier, en francs CFA entiers.
 * @returns Le montant accepté, ou le message à corriger.
 */
export function parseTransfer(memberId: string, amount: string): FormResult<bigint> {
  if (memberId === "") return formError("Choisissez un destinataire.");

  const parsed = parseAmountInput(amount);
  if (parsed === null) return formError("Saisissez un montant valide en FCFA.");

  return formOk(parsed);
}
