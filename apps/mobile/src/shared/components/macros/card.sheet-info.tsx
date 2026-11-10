import type { ReactNode } from "react";
import { View } from "react-native";

/** Props d'une carte d'information de feuille. */
export interface SheetInfoCardProps {
  readonly children: ReactNode;
}

/**
 * Regroupe un titre et son texte dans une carte bordée de feuille.
 * @param props Contenu de la carte.
 * @returns La carte d'information.
 */
export function SheetInfoCard(props: SheetInfoCardProps) {
  const { children } = props;

  return (
    <View className="gap-1 rounded-[14px] border border-card-border px-4 py-3">{children}</View>
  );
}
