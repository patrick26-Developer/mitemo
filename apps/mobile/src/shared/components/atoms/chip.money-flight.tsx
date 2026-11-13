import { Coins } from "lucide-react-native";
import { Text, View } from "react-native";

import { formatAmount } from "../../format/format.amount";
import { PALETTE } from "../../theme/theme.palette";

/** Vert de l'argent qui arrive. */
const MONEY_GREEN = "#1F8A4C";

/** Props de la pastille d'argent en vol. */
export interface MoneyFlightChipProps {
  /** Montant qui s'ajoute, en plus petite unité de la devise. */
  readonly amount: bigint;
}

/**
 * Pastille verte du montant qui s'ajoute, « +5 500 FCFA », avec ses pièces.
 * @param props Montant à afficher.
 * @returns La pastille.
 */
export function MoneyFlightChip(props: MoneyFlightChipProps) {
  return (
    <View
      className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
      style={{ backgroundColor: MONEY_GREEN }}
    >
      <Coins size={16} color={PALETTE.white} strokeWidth={2.2} />
      <Text className="text-[15px] font-bold text-white">{`+${formatAmount(props.amount)} FCFA`}</Text>
    </View>
  );
}
