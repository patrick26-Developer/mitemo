import { Text, View } from "react-native";

import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { accentColors } from "../../../shared/model/model.accent-color";
import type { ContributionCell, ContributionLevel } from "../model/model.card-contributions";
import {
  cardContributions,
  contributionLabel,
  contributionSummary,
} from "../model/model.card-contributions";

/** Opacité de chaque intensité, en suffixe hexadécimal de la couleur vive. */
const LEVEL_ALPHA: Readonly<Record<ContributionLevel, string>> = {
  0: "26",
  1: "66",
  2: "B3",
  3: "FF",
};

/** Intensités de la légende, de la plus claire à la plus foncée. */
const LEGEND: readonly ContributionLevel[] = [0, 1, 2, 3];

/** Props de la grille d'assiduité. */
export interface CardContributionsGridProps {
  readonly item: SavingsCard;
}

/** Props d'une case. */
interface CellProps {
  readonly level: ContributionLevel;
  readonly vivid: string;
  readonly label?: string;
}

/**
 * Case de la grille, teintée selon son intensité.
 * @param props Intensité, couleur et libellé éventuel.
 * @returns La case.
 */
function Cell(props: CellProps) {
  const { level, vivid, label } = props;
  return (
    <View
      testID={label === undefined ? undefined : `contribution-level-${level}`}
      accessible={label !== undefined}
      accessibilityLabel={label}
      className="h-3.5 w-3.5 rounded-[3px]"
      style={{ backgroundColor: `${vivid}${LEVEL_ALPHA[level]}` }}
    />
  );
}

/**
 * Assiduité d'une carte échue, comme le calendrier des contributions de
 * GitHub : une case par pointage prévu, plus foncée quand il a été réglé.
 * @param props Carte de pointage.
 * @returns Le titre, le résumé, la grille et sa légende.
 */
export function CardContributionsGrid(props: CardContributionsGridProps) {
  const contributions = cardContributions(props.item);
  const vivid = accentColors(props.item.tint).background;
  const toCell = (cell: ContributionCell) => (
    <Cell key={cell.start} level={cell.level} vivid={vivid} label={contributionLabel(cell)} />
  );

  return (
    <View className="gap-3">
      <View className="flex-row items-baseline justify-between">
        <Text className="text-[16px] font-semibold text-ink">Assiduité</Text>
        <Text className="text-[13px] text-muted">{contributionSummary(contributions)}</Text>
      </View>
      <View className="flex-row flex-wrap gap-1">{contributions.cells.map(toCell)}</View>
      <View className="flex-row items-center justify-end gap-1">
        <Text className="mr-1 text-[11px] text-muted">Moins</Text>
        {LEGEND.map((level) => (
          <Cell key={level} level={level} vivid={vivid} />
        ))}
        <Text className="ml-1 text-[11px] text-muted">Plus</Text>
      </View>
    </View>
  );
}
