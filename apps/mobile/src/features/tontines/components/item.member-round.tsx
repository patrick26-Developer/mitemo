import { Text, View } from "react-native";

import { CheckMark } from "../../../shared/components/atoms/mark.check";

/** Props d'un tour dans l'historique d'un membre. */
export interface MemberRoundItemProps {
  readonly round: number;
  /** Vrai quand le membre a cotisé pour ce tour. */
  readonly paid: boolean;
  /** Cotisation du tour, déjà formatée, par exemple « 5 000 FCFA ». */
  readonly amount: string;
  /** Teinte de la tontine. */
  readonly accent: string;
}

/**
 * Tour de l'historique d'un membre, sur le modèle des pointages d'une carte :
 * coché quand la cotisation est réglée.
 * @param props Tour, état, montant et teinte.
 * @returns La ligne du tour.
 */
export function MemberRoundItem(props: MemberRoundItemProps) {
  const { round, paid, amount, accent } = props;
  const status = paid ? "Réglé" : "En attente";

  return (
    <View
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked: paid }}
      accessibilityLabel={`Tour ${round}, ${amount}, ${status}`}
      className="flex-row items-center gap-3 rounded-[16px] border border-card-border bg-white px-4 py-3.5"
    >
      <CheckMark done={paid} accent={accent} />
      <View className="flex-1 gap-0.5">
        <Text className="text-[14px] font-medium text-ink">Tour {round}</Text>
        <Text className="text-[12px] text-muted">{status}</Text>
      </View>
      <Text className={`text-[14px] font-semibold ${paid ? "text-ink" : "text-muted"}`}>
        {amount}
      </Text>
    </View>
  );
}
