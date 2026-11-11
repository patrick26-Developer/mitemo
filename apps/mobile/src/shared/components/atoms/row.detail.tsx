import type { ReactNode } from "react";
import { Text, View } from "react-native";

/** Props d'une ligne d'information d'un écran de détail. */
export interface DetailRowProps {
  readonly label: string;
  readonly value: string;
  /** Petite icône posée devant le libellé. */
  readonly icon?: ReactNode;
}

/**
 * Affiche un libellé et sa valeur sur une même ligne, avec une petite icône
 * devant le libellé quand elle est fournie.
 * @param props Libellé, valeur et icône à afficher.
 * @returns La ligne d'information.
 */
export function DetailRow(props: DetailRowProps) {
  const { label, value, icon } = props;

  return (
    <View className="flex-row items-center justify-between gap-4">
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="text-[14px] text-muted">{label}</Text>
      </View>
      <Text className="text-[14px] font-medium text-ink">{value}</Text>
    </View>
  );
}
