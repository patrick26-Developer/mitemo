/**
 * Moyens de paiement proposés pour régler une cotisation ou un pointage : les
 * deux opérateurs mobiles, puis le solde du membre dans Mitemo.
 */
export const PAYMENT_METHODS = ["MTN_MOMO", "AIRTEL_MONEY", "MITEMO"] as const;

/** Moyen de paiement. Voir {@link PAYMENT_METHODS}. */
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Nom court de chaque moyen, tel qu'il figure sur le bouton « Payer avec … ». */
const PAYMENT_METHOD_NAMES: Readonly<Record<PaymentMethod, string>> = {
  MTN_MOMO: "MTN MoMo",
  AIRTEL_MONEY: "Airtel Money",
  MITEMO: "Mitemo",
};

/** Nom de chaque moyen dans un historique ou un message de confirmation. */
const PAYMENT_METHOD_LABELS: Readonly<Record<PaymentMethod, string>> = {
  MTN_MOMO: "MTN MoMo",
  AIRTEL_MONEY: "Airtel Money",
  MITEMO: "Solde Mitemo",
};

/**
 * Nomme un moyen de paiement sur son bouton.
 * @param method Moyen de paiement.
 * @returns Le nom court, par exemple « MTN MoMo ».
 */
export function paymentMethodName(method: PaymentMethod): string {
  return PAYMENT_METHOD_NAMES[method];
}

/**
 * Nomme un moyen de paiement dans l'historique.
 * @param method Moyen de paiement.
 * @returns Le nom présenté au membre.
 */
export function paymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method];
}

/**
 * Indique si le paiement passe par un opérateur mobile : il se valide alors sur
 * le téléphone du membre, avec le code secret de l'opérateur, et non dans Mitemo.
 * @param method Moyen de paiement.
 * @returns `true` pour MTN MoMo et Airtel Money.
 */
export function isMobileMoney(method: PaymentMethod): boolean {
  return method !== "MITEMO";
}
