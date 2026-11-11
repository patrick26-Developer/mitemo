import { z } from "zod";

import { parseAmountInput } from "../../../shared/model/model.amount-input";
import { amountSchema, parseWithSchema } from "../../../shared/model/model.form-schema";
import type { FormResult } from "../../../shared/model/model.form-result";
import { formOk } from "../../../shared/model/model.form-result";

/** Champs saisis pour transférer un montant à un membre. */
export interface TransferFormState {
  /** Membre choisi, chaîne vide quand aucun n'est sélectionné. */
  readonly memberId: string;
  /** Montant saisi au clavier, en francs CFA entiers. */
  readonly amount: string;
}

/** Formulaire proposé à l'ouverture de la feuille de transfert. */
export const INITIAL_TRANSFER_FORM: TransferFormState = { memberId: "", amount: "" };

/** Récapitulatif d'un transfert en cours de saisie. */
export interface TransferRecap {
  /** Montant analysé, `null` tant que la saisie n'est pas valide. */
  readonly amount: bigint | null;
}

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

/**
 * Résume le montant d'un transfert en cours de saisie.
 * @param form Champs saisis.
 * @returns Le montant affichable, `null` tant que la saisie est invalide.
 */
export function transferRecap(form: TransferFormState): TransferRecap {
  return { amount: parseAmountInput(form.amount) };
}
