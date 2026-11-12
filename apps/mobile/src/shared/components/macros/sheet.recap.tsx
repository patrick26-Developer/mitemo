import { Text, View } from "react-native";

import { SheetInfoCard } from "./card.sheet-info";

/** Ligne du récapitulatif d'une feuille. */
export interface SheetRecapRow {
  readonly label: string;
  readonly value: string;
}

/** Props d'un récapitulatif de feuille. */
export interface SheetRecapProps {
  /** Titre de la carte, omis quand le titre de l'étape le dit déjà. */
  readonly title?: string;
  /** Lignes à afficher ; un récapitulatif vide n'est pas rendu. */
  readonly rows: readonly SheetRecapRow[];
}

/**
 * Résume les conséquences d'une saisie dans une carte discrète, pour que le
 * membre voie le résultat avant de valider.
 * @param props Titre et lignes du récapitulatif.
 * @returns Le récapitulatif, ou rien quand il n'a aucune ligne.
 */
export function SheetRecap(props: SheetRecapProps) {
  const { title, rows } = props;

  if (rows.length === 0) return null;

  return (
    <SheetInfoCard>
      {title === undefined ? null : (
        <Text className="text-[12px] font-semibold uppercase text-muted">{title}</Text>
      )}
      {rows.map((row) => (
        <View key={row.label} className="flex-row items-center justify-between gap-4 pt-1">
          <Text className="text-[13px] text-muted">{row.label}</Text>
          <Text className="text-[13px] font-medium text-ink">{row.value}</Text>
        </View>
      ))}
    </SheetInfoCard>
  );
}
