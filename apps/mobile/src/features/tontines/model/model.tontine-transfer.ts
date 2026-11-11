import { z } from "zod";

import { amountSchema, parseWithSchema } from "../../../shared/model/model.form-schema";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formOk } from "../../../shared/model/model.form-result";

/** Schéma d'un transfert : destinataire obligatoire et montant strictement positif. */
const transferSchema = z.object({
  memberId: z.string().min(1, "Choisissez un destinataire."),
  amount: amountSchema("Saisissez un montant valide en FCFA."),
});

/**
 * Valide le destinataire et le montant d'un transfert vers un membre.
 * @param memberId Membre choisi, chaîne vide quand aucun n'est sélectionné.
 * @param amount Texte saisi au clavier, en francs CFA entiers.
 * @returns Le montant accepté, ou le message à corriger.
 */
export function parseTransfer(memberId: string, amount: string): FormResult<bigint> {
  const parsed = parseWithSchema(transferSchema, { memberId, amount });
  if (!parsed.ok) return parsed;

  return formOk(parsed.value.amount);
}
