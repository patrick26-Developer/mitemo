import { Text, View } from "react-native";

/** Props d'une ligne d'information d'un écran de détail. */
export interface DetailRowProps {
  readonly label: string;
  readonly value: string;
}

/**
 * Affiche un libellé et sa valeur sur une même ligne.
 * @param props Libellé et valeur à afficher.
 * @returns La ligne d'information.
 */
export function DetailRow(props: DetailRowProps) {
  const { label, value } = props;

  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="text-[14px] text-muted">{label}</Text>
      <Text className="text-[14px] font-medium text-ink">{value}</Text>
    </View>
  );
}
