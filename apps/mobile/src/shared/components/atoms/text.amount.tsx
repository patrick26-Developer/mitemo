import { Text } from "react-native";

import { formatAmount } from "../../format/format.amount";

/** Classe par défaut du montant principal, à la taille d'une synthèse. */
const DEFAULT_CLASSES = "text-[30px] font-medium text-ink";

/** Props d'un montant affiché avec sa devise. */
export interface AmountTextProps {
  /** Montant en plus petite unité de la devise (franc CFA). */
  readonly amount: bigint;
  /** Classe du montant principal, quand son contexte impose une autre taille. */
  readonly className?: string;
}

/**
 * Affiche un montant en francs CFA, la devise en petit à sa suite.
 * @param props Montant et classe du texte principal.
 * @returns Le montant lisible suivi de sa devise.
 */
export function AmountText(props: AmountTextProps) {
  const { amount, className = DEFAULT_CLASSES } = props;

  return (
    <Text className={className}>
      {formatAmount(amount)} <Text className="text-[16px] font-normal">FCFA</Text>
    </Text>
  );
}
