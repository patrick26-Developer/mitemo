import type { ReactNode } from "react";
import { useState } from "react";
import Animated, { FadeIn, SlideInLeft, SlideInRight } from "react-native-reanimated";

import type { StepDirection } from "../../model/model.step-direction";
import { stepDirection } from "../../model/model.step-direction";

/** Durée du glissement d'une étape à l'autre, en millisecondes. */
const STEP_TRANSITION_MS = 240;

/** Entrée de la nouvelle étape, de la droite en avançant, de la gauche en revenant. */
const ENTERING: Readonly<Record<StepDirection, SlideInRight | SlideInLeft>> = {
  forward: SlideInRight.duration(STEP_TRANSITION_MS),
  back: SlideInLeft.duration(STEP_TRANSITION_MS),
};

/** Props de la transition entre étapes. */
export interface StepTransitionProps {
  /** Étape courante, à partir de 0. */
  readonly index: number;
  readonly children: ReactNode;
}

/**
 * Fait glisser le contenu d'un formulaire en étapes à chaque changement
 * d'étape : la nouvelle arrive de la droite en avançant, de la gauche en
 * revenant ; la première s'affiche en fondu.
 * @param props Étape courante et son contenu.
 * @returns Le contenu animé de l'étape.
 */
export function StepTransition(props: StepTransitionProps) {
  const { index, children } = props;
  const [shown, setShown] = useState({ index, direction: null as StepDirection | null });
  if (shown.index !== index) setShown({ index, direction: stepDirection(shown.index, index) });
  const entering =
    shown.direction === null ? FadeIn.duration(STEP_TRANSITION_MS) : ENTERING[shown.direction];

  return (
    <Animated.View
      key={index}
      testID={`step-transition-${index}`}
      entering={entering}
      className="gap-4"
    >
      {children}
    </Animated.View>
  );
}
