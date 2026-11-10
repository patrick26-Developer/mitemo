import { Text } from "react-native";

/** Props d'un paragraphe de feuille. */
export interface SheetTextProps {
  readonly children: string;
}

/**
 * Affiche un paragraphe lisible dans une feuille.
 * @param props Texte à afficher.
 * @returns Le paragraphe.
 */
export function SheetText(props: SheetTextProps) {
  const { children } = props;

  return <Text className="text-[14px] leading-5 text-muted">{children}</Text>;
}
