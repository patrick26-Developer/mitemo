/** Moyen de paiement du membre, affiché dans sa feuille. */
export interface ProfilePaymentMethod {
  readonly id: string;
  readonly label: string;
  /** Numéro masqué ou fin de carte, jamais l'identifiant complet. */
  readonly detail: string;
}

/** Moyens de paiement de démonstration. */
export const PROFILE_PAYMENT_METHODS: readonly ProfilePaymentMethod[] = [
  { id: "airtel", label: "Airtel Money", detail: "06 512 34 56" },
  { id: "mtn", label: "MTN Mobile Money", detail: "05 478 90 12" },
  { id: "visa", label: "Carte bancaire", detail: "•••• 4821" },
];
