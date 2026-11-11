import { Text, View } from "react-native";

/** Props de l'indicateur d'étape. */
export interface StepIndicatorProps {
  /** Étape courante, à partir de 0. */
  readonly index: number;
  readonly total: number;
  /** Ce que l'étape demande, par exemple « L'essentiel ». */
  readonly title: string;
}

/**
 * Indique où en est le membre dans un formulaire en plusieurs étapes : un
 * segment par étape, le numéro et le titre de l'étape courante.
 * @param props Étape courante, nombre d'étapes et titre.
 * @returns L'indicateur d'étape.
 */
export function StepIndicator(props: StepIndicatorProps) {
  const { index, total, title } = props;
  const position = `Étape ${index + 1} sur ${total}`;
  const segments = Array.from({ length: total }, (_, step) => step <= index);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${position} : ${title}`}
      accessibilityValue={{ min: 1, max: total, now: index + 1 }}
      className="gap-2"
    >
      <View className="flex-row gap-1.5">
        {segments.map((done, step) => (
          <View
            key={`step-${step}`}
            testID={done ? "step-segment-done" : "step-segment-todo"}
            className={`h-1.5 flex-1 rounded-full ${done ? "bg-brand" : "bg-brand-veil"}`}
          />
        ))}
      </View>
      <View className="flex-row items-baseline justify-between">
        <Text className="text-[16px] font-semibold text-ink">{title}</Text>
        <Text className="text-[12px] text-muted">{position}</Text>
      </View>
    </View>
  );
}
