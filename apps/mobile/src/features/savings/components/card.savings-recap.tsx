import { Text, View } from "react-native";

import { ProgressBar } from "../../../shared/components/atoms/bar.progress";
import { NoisePattern } from "../../../shared/components/atoms/pattern.noise";
import { AmountText } from "../../../shared/components/atoms/text.amount";
import { MoneyFlightTarget } from "../../../shared/components/macros/target.money-flight";
import { RecapFactList } from "../../../shared/components/macros/list.recap-facts";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardProgress } from "../../../shared/member/model.portfolio";
import { cardStatus } from "../model/model.card-status";
import { recapFactRows, recapGoalLines } from "../model/model.card-recap";
import { RecapFactIcon } from "./icon.recap-fact";

/** Props de la carte récapitulative d'une carte de pointage. */
export interface SavingsRecapCardProps {
  readonly item: SavingsCard;
  /** Nom de la tontine liée, `null` quand la carte est indépendante. */
  readonly tontineName: string | null;
}

/**
 * Réunit sur une seule carte tout ce qu'il faut savoir d'une carte de
 * pointage : montant actuel, objectif, montant et fréquence des pointages,
 * progression, reste à épargner, frais Mitemo, dates de création et
 * d'échéance, et tontine liée. Les sections sont séparées par le même espace.
 * @param props Carte à résumer et nom de sa tontine.
 * @returns La carte récapitulative.
 */
export function SavingsRecapCard(props: SavingsRecapCardProps) {
  const { item, tontineName } = props;

  return (
    <View
      testID="savings-recap-card"
      className="gap-4 overflow-hidden rounded-[20px] p-5"
      style={{ backgroundColor: item.tint }}
    >
      <NoisePattern />
      <View className="gap-1">
        <Text className="text-[14px] text-ink">Montant actuel</Text>
        <MoneyFlightTarget>
          <AmountText amount={item.saved} />
        </MoneyFlightTarget>
        <RecapGoal item={item} />
      </View>
      <RecapProgress item={item} />
      <View className="h-px bg-ink/10" />
      <RecapFacts item={item} tontineName={tontineName} />
    </View>
  );
}

/** Props des lignes du plan de la carte. */
interface RecapGoalProps {
  readonly item: SavingsCard;
}

/**
 * Détaille le plan sous le montant actuel : objectif, montant d'un pointage et
 * fréquence, une ligne chacun.
 * @param props Carte concernée.
 * @returns Les lignes du plan.
 */
function RecapGoal(props: RecapGoalProps) {
  return (
    <View className="mt-1 gap-0.5">
      {recapGoalLines(props.item).map((line) => (
        <Text key={line.label} className="text-[13px] text-ink">
          <Text className="text-ink/60">{line.label} : </Text>
          {line.value}
        </Text>
      ))}
    </View>
  );
}

/** Props du bloc de progression. */
interface RecapProgressProps {
  readonly item: SavingsCard;
}

/**
 * Affiche l'étape de la carte, ses pointages faits et sa barre de progression.
 * @param props Carte concernée.
 * @returns Le bloc de progression.
 */
function RecapProgress(props: RecapProgressProps) {
  const status = cardStatus(props.item);

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="rounded-full bg-white/70 px-2.5 py-1 text-[12px] font-semibold text-ink">
          {status.label}
        </Text>
        <Text className="text-[13px] text-ink">{status.detail}</Text>
      </View>
      <ProgressBar value={cardProgress(props.item)} accent={props.item.tint} />
    </View>
  );
}

/**
 * Liste le reste à épargner, les frais, les dates et la tontine liée, chacun
 * précédé de sa petite icône, avec un trait entre chaque ligne.
 * @param props Carte concernée et nom de sa tontine.
 * @returns Les lignes d'information.
 */
function RecapFacts(props: SavingsRecapCardProps) {
  const rows = recapFactRows(props.item, props.tontineName).map((row) => ({
    id: row.kind,
    label: row.label,
    value: row.value,
    icon: <RecapFactIcon kind={row.kind} />,
  }));

  return <RecapFactList rows={rows} />;
}
