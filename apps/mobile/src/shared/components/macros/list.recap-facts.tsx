import type { ReactNode } from "react";
import { View } from "react-native";

import { DetailRow } from "../atoms/row.detail";

/** Ligne d'information d'une carte récapitulative. */
export interface RecapFact {
  /** Identifiant stable de la ligne. */
  readonly id: string;
  readonly label: string;
  readonly value: string;
  /** Petite icône posée devant le libellé. */
  readonly icon: ReactNode;
}

/** Props de la liste des informations d'une carte récapitulative. */
export interface RecapFactListProps {
  readonly rows: readonly RecapFact[];
}

/**
 * Espace vertical d'une ligne : la première colle au trait de section et la
 * dernière au bas de la carte, pour que l'espace soit le même partout.
 * @param index Rang de la ligne.
 * @param count Nombre de lignes.
 * @returns Les classes d'espacement.
 */
function factPadding(index: number, count: number): string {
  const top = index === 0 ? "pt-0" : "pt-3";
  const bottom = index === count - 1 ? "pb-0" : "pb-3";
  return `${top} ${bottom}`;
}

/**
 * Liste les informations d'une carte récapitulative, chacune précédée de son
 * icône, avec un trait entre deux lignes.
 * @param props Lignes à afficher.
 * @returns Les lignes d'information.
 */
export function RecapFactList(props: RecapFactListProps) {
  const { rows } = props;

  return (
    <View>
      {rows.map((row, index) => (
        <View key={row.id}>
          {index === 0 ? null : <View testID="recap-fact-divider" className="h-px bg-ink/10" />}
          <View className={factPadding(index, rows.length)}>
            <DetailRow label={row.label} value={row.value} icon={row.icon} />
          </View>
        </View>
      ))}
    </View>
  );
}
