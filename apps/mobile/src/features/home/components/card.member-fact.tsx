import { BriefcaseBusiness, CalendarDays, Phone, UserRound } from "lucide-react-native";
import { Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";
import type { MemberFactKind, MemberSummaryRow } from "../model/model.member-summary";

/** Icône de chaque information du résumé. */
const FACT_ICONS = {
  name: UserRound,
  phone: Phone,
  occupation: BriefcaseBusiness,
  createdAt: CalendarDays,
} as const satisfies Record<MemberFactKind, unknown>;

/** Props d'une carte d'information du membre. */
export interface MemberFactCardProps {
  readonly row: MemberSummaryRow;
}

/**
 * Affiche une information du membre sur une ligne sans bordure, avec l'icône
 * grise du profil à gauche et le libellé au-dessus de la valeur.
 * @param props Information à afficher.
 * @returns La carte d'information.
 */
export function MemberFactCard(props: MemberFactCardProps) {
  const { kind, label, value } = props.row;
  const Icon = FACT_ICONS[kind];

  return (
    <View testID={`member-fact-card-${kind}`} className="flex-row items-center gap-3 py-3.5">
      <Icon testID={`member-fact-icon-${kind}`} size={20} color={PALETTE.muted} />
      <View className="flex-1 gap-0.5">
        <Text className="text-[13px] text-muted">{label}</Text>
        <Text className="text-[15px] font-semibold text-ink">{value}</Text>
      </View>
    </View>
  );
}
