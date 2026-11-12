import { View } from "react-native";

import type { FactItem } from "../atoms/row.fact";
import { FactRow } from "../atoms/row.fact";

/** Props d'une liste d'informations. */
export interface FactListProps {
  readonly items: readonly FactItem[];
}

/**
 * Liste d'informations séparées par un trait fin, sans carte autour : le
 * design de « Mes informations », repris par les récapitulatifs.
 * @param props Informations à afficher.
 * @returns La liste, ou rien sans information.
 */
export function FactList(props: FactListProps) {
  if (props.items.length === 0) return null;

  return (
    <View>
      {props.items.map((item, index) => (
        <View key={item.id}>
          {index === 0 ? null : <View testID="fact-divider" className="h-px bg-card-border" />}
          <FactRow item={item} />
        </View>
      ))}
    </View>
  );
}
