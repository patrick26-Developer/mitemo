import { Fragment } from "react";
import { Text, View } from "react-native";

/** Props de l'indicateur d'étape. */
export interface StepIndicatorProps {
  /** Étape courante, à partir de 0. */
  readonly index: number;
  readonly total: number;
  /** Ce que l'étape demande, par exemple « L'essentiel ». */
  readonly title: string;
}

/** Props des pastilles numérotées d'un formulaire. */
interface StepMarkersProps {
  readonly index: number;
  readonly total: number;
}

/**
 * Dessine une pastille numérotée par étape, reliées par un filet : [1]---[2].
 * @param props Étape courante et nombre d'étapes.
 * @returns La ligne des étapes.
 */
function StepMarkers(props: StepMarkersProps) {
  const { index, total } = props;
  const steps = Array.from({ length: total }, (_, step) => step);

  return (
    <View className="flex-row items-center">
      {steps.map((step) => (
        <Fragment key={`step-${step}`}>
          {step > 0 ? (
            <View
              className={`h-px flex-1 ${step <= index ? "bg-brand" : "bg-hairline"}`}
              testID="step-connector"
            />
          ) : null}
          <View
            testID={step <= index ? "step-marker-done" : "step-marker-todo"}
            className={`h-7 w-7 items-center justify-center rounded-full ${
              step <= index ? "bg-brand" : "bg-field"
            }`}
          >
            <Text
              className={`text-[12px] font-semibold ${step <= index ? "text-white" : "text-muted"}`}
            >
              {step + 1}
            </Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

/**
 * Indique où en est le membre dans un formulaire en plusieurs étapes : une
 * pastille numérotée par étape, reliée par un filet. Le titre et la position
 * ne sont annoncés qu'aux lecteurs d'écran.
 * @param props Étape courante, nombre d'étapes et titre.
 * @returns L'indicateur d'étape.
 */
export function StepIndicator(props: StepIndicatorProps) {
  const { index, total, title } = props;
  const position = `Étape ${index + 1} sur ${total}`;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${position} : ${title}`}
      accessibilityValue={{ min: 1, max: total, now: index + 1 }}
      className="gap-2"
    >
      <StepMarkers index={index} total={total} />
    </View>
  );
}
