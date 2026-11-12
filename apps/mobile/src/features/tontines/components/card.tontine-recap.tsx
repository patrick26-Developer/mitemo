import { CircleCheck, Coins, Hourglass, UserRound } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { ProgressBar } from "../../../shared/components/atoms/bar.progress";
import { FactPillIcon } from "../../../shared/components/atoms/icon.fact-pill";
import { NoisePattern } from "../../../shared/components/atoms/pattern.noise";
import { AmountText } from "../../../shared/components/atoms/text.amount";
import { RecapFactList } from "../../../shared/components/macros/list.recap-facts";
import type { Tontine } from "../../../shared/member/model.portfolio";
import type { TontineFactKind } from "../model/model.tontine-recap";
import {
  tontineFactRows,
  tontineGoalLines,
  tontineProgress,
  tontineStatus,
} from "../model/model.tontine-recap";

/** Icône de chaque nature de ligne du récapitulatif. */
const FACT_ICONS: Readonly<Record<TontineFactKind, LucideIcon>> = {
  pot: Coins,
  beneficiary: UserRound,
  paid: CircleCheck,
  remaining: Hourglass,
};

/** Props de la carte récapitulative d'une tontine. */
export interface TontineRecapCardProps {
  readonly item: Tontine;
}

/**
 * Réunit sur une seule carte, comme celle d'une carte de pointage, tout ce
 * qu'il faut savoir d'une tontine : cotisation, plan, avancement, cagnotte,
 * bénéficiaire, cotisations reçues et tours restants.
 * @param props Tontine à résumer.
 * @returns La carte récapitulative.
 */
export function TontineRecapCard(props: TontineRecapCardProps) {
  const { item } = props;

  return (
    <View
      testID="tontine-recap-card"
      className="gap-4 overflow-hidden rounded-[20px] p-5"
      style={{ backgroundColor: item.headerColors[1] }}
    >
      <NoisePattern />
      <View className="gap-1">
        <Text className="text-[14px] text-ink">Cotisation du tour</Text>
        <AmountText amount={item.contribution} />
        <TontineGoal item={item} />
      </View>
      <TontineProgress item={item} />
      <View className="h-px bg-ink/10" />
      <RecapFactList
        rows={tontineFactRows(item).map((row) => ({
          id: row.kind,
          label: row.label,
          value: row.value,
          icon: (
            <FactPillIcon icon={FACT_ICONS[row.kind]} testID={`tontine-fact-icon-${row.kind}`} />
          ),
        }))}
      />
    </View>
  );
}

/**
 * Détaille le plan sous la cotisation, une ligne par information.
 * @param props Tontine concernée.
 * @returns Les lignes du plan.
 */
function TontineGoal(props: TontineRecapCardProps) {
  return (
    <View className="mt-1 gap-0.5">
      {tontineGoalLines(props.item).map((line) => (
        <Text key={line.label} className="text-[13px] text-ink">
          <Text className="text-ink/60">{line.label} : </Text>
          {line.value}
        </Text>
      ))}
    </View>
  );
}

/**
 * Affiche l'étape de la tontine, son détail et sa barre de progression.
 * @param props Tontine concernée.
 * @returns Le bloc de progression.
 */
function TontineProgress(props: TontineRecapCardProps) {
  const status = tontineStatus(props.item);

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="rounded-full bg-white/70 px-2.5 py-1 text-[12px] font-semibold text-ink">
          {status.label}
        </Text>
        <Text className="text-[13px] text-ink">{status.detail}</Text>
      </View>
      <ProgressBar value={tontineProgress(props.item)} accent={props.item.headerColors[0]} />
    </View>
  );
}
