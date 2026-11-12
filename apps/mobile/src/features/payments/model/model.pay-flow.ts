import { formatAmount } from "../../../shared/format/format.amount";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { isMobileMoney } from "../../../shared/model/model.payment-method";

/**
 * Étapes de la feuille de paiement : choix du moyen, attente de la validation
 * sur le téléphone (Mobile Money) ou code PIN (solde Mitemo).
 */
export const PAY_STAGES = ["choose", "pending", "pin"] as const;

/** Étape de la feuille de paiement. Voir {@link PAY_STAGES}. */
export type PayStage = (typeof PAY_STAGES)[number];

/** Opérateur mobile, seul concerné par l'attente de validation. */
type MobileOperator = Exclude<PaymentMethod, "MITEMO">;

/**
 * Code USSD qui ouvre le menu de chaque opérateur au Congo. MTN : *105#, donné
 * par l'équipe produit. Airtel : *128#, d'après la page d'aide Airtel Congo de
 * TapTapSend (support.taptapsend.com), à confirmer auprès d'Airtel.
 */
const OPERATOR_CODES: Readonly<Record<MobileOperator, string>> = {
  MTN_MOMO: "*105#",
  AIRTEL_MONEY: "*128#",
};

/** Nom de chaque opérateur dans les instructions. */
const OPERATOR_NAMES: Readonly<Record<MobileOperator, string>> = {
  MTN_MOMO: "MTN MoMo",
  AIRTEL_MONEY: "Airtel Money",
};

/**
 * Choisit l'étape qui suit le choix du moyen : le Mobile Money se valide sur
 * le téléphone, sans code Mitemo ; le solde Mitemo demande le code PIN.
 * @param method Moyen choisi.
 * @returns L'étape suivante.
 */
export function payStageFor(method: PaymentMethod): Exclude<PayStage, "choose"> {
  return isMobileMoney(method) ? "pending" : "pin";
}

/**
 * Explique, pas à pas, comment valider un paiement Mobile Money sur le
 * téléphone avant de revenir dans Mitemo.
 * @param method Opérateur mobile choisi.
 * @param amount Montant demandé, en plus petite unité de la devise.
 * @returns Les instructions, dans l'ordre.
 */
export function pendingInstructions(method: MobileOperator, amount: bigint): readonly string[] {
  return [
    `Une demande de paiement de ${formatAmount(amount)} FCFA vient d'être envoyée sur votre compte ${OPERATOR_NAMES[method]}.`,
    `Composez ${OPERATOR_CODES[method]} sur votre téléphone et confirmez le paiement.`,
    "Revenez ensuite sur Mitemo : le paiement se valide tout seul dès sa confirmation.",
  ];
}
