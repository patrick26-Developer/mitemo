import type { ReactNode } from "react";
import { View } from "react-native";

/** Props d'une carte de détails de feuille. */
export interface DetailCardProps {
  readonly children: ReactNode;
}

/**
 * Regroupe des lignes de détail dans une carte bordée.
 * @param props Lignes de détail à afficher.
 * @returns La carte de détails.
 */
export function DetailCard(props: DetailCardProps) {
  const { children } = props;

  return <View className="gap-3 rounded-[16px] border border-card-border p-4">{children}</View>;
}
