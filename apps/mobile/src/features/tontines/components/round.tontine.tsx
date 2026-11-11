import { Text, View } from "react-native";

import { ProgressBar } from "../../../shared/components/atoms/bar.progress";

/** Props de la progression d'une tontine. */
export interface TontineRoundProps {
  /** Tour en cours, à partir de 1. */
  readonly round: number;
  readonly totalRounds: number;
  /** Couleur de la tontine : la barre prend sa nuance vive. */
  readonly accent?: string;
}

/**
 * Affiche l'avancement du cycle et le numéro du tour en cours.
 * @param props Tour en cours, nombre total de tours et couleur de la tontine.
 * @returns La progression du cycle.
 */
export function TontineRound(props: TontineRoundProps) {
  const { round, totalRounds, accent } = props;

  return (
    <View className="flex-row items-center gap-2">
      <ProgressBar value={round / totalRounds} {...(accent === undefined ? {} : { accent })} />
      <View className="rounded-[3px] bg-card px-1.5 py-[3px]">
        <Text className="text-[11px] text-white">
          Tour {round} / {totalRounds}
        </Text>
      </View>
    </View>
  );
}
