import { Text } from "react-native";

import { formatAmount } from "../../format/format.amount";
import { maskAmountText } from "../../model/model.amount-mask";

/** Classe par défaut du montant principal, à la taille d'une synthèse. */
const DEFAULT_CLASSES = "text-[30px] font-medium text-ink";

/** Props d'un montant affiché avec sa devise. */
export interface AmountTextProps {
  /** Montant en plus petite unité de la devise (franc CFA). */
  readonly amount: bigint;
  /** Classe du montant principal, quand son contexte impose une autre taille. */
  readonly className?: string;
  /**
   * `true` quand le montant doit être masqué, par exemple dans un lieu public.
   * Le masque reste lisible comme un montant, mais ne révèle aucun chiffre.
   */
  readonly masked?: boolean;
}

/**
 * Affiche un montant en francs CFA, la devise en petit à sa suite.
 * @param props Montant, classe du texte principal et mode masqué.
 * @returns Le montant lisible suivi de sa devise.
 */
export function AmountText(props: AmountTextProps) {
  const { amount, className = DEFAULT_CLASSES, masked = false } = props;
  const readable = formatAmount(amount);

  return (
    <Text className={className}>
      {masked ? maskAmountText(readable) : readable}{" "}
      <Text className="text-[16px] font-normal">FCFA</Text>
    </Text>
  );
}
