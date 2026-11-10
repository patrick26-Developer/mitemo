import type { ReactNode } from "react";
import { Text, View } from "react-native";

/** Props d'une section de feuille. */
export interface SheetSectionProps {
  /** Titre de la section ; absent pour une section sans en-tête. */
  readonly title?: string;
  readonly children: ReactNode;
}

/**
 * Regroupe des lignes sous un titre, dans une feuille.
 * @param props Titre facultatif et contenu de la section.
 * @returns La section de feuille.
 */
export function SheetSection(props: SheetSectionProps) {
  const { title, children } = props;

  return (
    <View className="gap-2">
      {title ? (
        <Text className="text-[12px] font-semibold uppercase text-muted">{title}</Text>
      ) : null}
      {children}
    </View>
  );
}
