import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Une information affichée en ligne : icône, libellé et valeur. */
export interface FactItem {
  /** Identifiant stable, repris dans les sélecteurs de test. */
  readonly id: string;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
}

/** Props d'une ligne d'information. */
export interface FactRowProps {
  readonly item: FactItem;
}

/**
 * Ligne d'information, comme dans « Mes informations » : icône grise, libellé
 * discret au-dessus de la valeur en gras.
 * @param props Information à afficher.
 * @returns La ligne.
 */
export function FactRow(props: FactRowProps) {
  const { id, icon: Icon, label, value } = props.item;

  return (
    <View testID={`fact-row-${id}`} className="flex-row items-center gap-3 py-3.5">
      <Icon testID={`fact-icon-${id}`} size={20} color={PALETTE.muted} />
      <View className="flex-1 gap-0.5">
        <Text className="text-[13px] text-muted">{label}</Text>
        <Text className="text-[15px] font-semibold text-ink">{value}</Text>
      </View>
    </View>
  );
}
