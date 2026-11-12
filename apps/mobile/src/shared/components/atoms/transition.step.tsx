import type { ReactNode } from "react";
import { useState } from "react";
import type { EntryOrExitLayoutType } from "react-native-reanimated";
import Animated, { Easing, Keyframe } from "react-native-reanimated";

import type { StepDirection } from "../../model/model.step-direction";
import { stepDirection, stepEnteringFrames } from "../../model/model.step-direction";

/** Durée de l'entrée d'une étape, en millisecondes. */
const STEP_TRANSITION_MS = 360;

/** Courbe de sortie douce (« ease-out quint ») : l'étape arrive vite et se pose lentement. */
const STEP_EASING = Easing.bezier(0.22, 1, 0.36, 1);

/**
 * Construit l'entrée d'une étape : fondu, court glissement et légère mise à
 * l'échelle, sur une seule courbe. Reanimated la joue sur le fil d'interface,
 * et la désactive quand le système demande moins d'animations.
 * @param direction Sens du passage.
 * @returns L'animation d'entrée.
 */
function stepEntering(direction: StepDirection): EntryOrExitLayoutType {
  const { from, to } = stepEnteringFrames(direction);

  return new Keyframe({
    0: { opacity: from.opacity, transform: [...from.transform] },
    100: { opacity: to.opacity, transform: [...to.transform], easing: STEP_EASING },
  }).duration(STEP_TRANSITION_MS);
}

/** Entrée de la nouvelle étape, selon le sens du passage. */
const ENTERING: Readonly<Record<StepDirection, EntryOrExitLayoutType>> = {
  forward: stepEntering("forward"),
  back: stepEntering("back"),
};

/** Props de la transition entre étapes. */
export interface StepTransitionProps {
  /** Étape courante, à partir de 0. */
  readonly index: number;
  readonly children: ReactNode;
}

/**
 * Anime le contenu d'un formulaire en étapes à chaque changement d'étape :
 * la nouvelle arrive en fondu du côté d'où elle vient (la droite en avançant,
 * la gauche en revenant). La première étape s'affiche sans animation, la
 * feuille ayant déjà la sienne.
 * @param props Étape courante et son contenu.
 * @returns Le contenu animé de l'étape.
 */
export function StepTransition(props: StepTransitionProps) {
  const { index, children } = props;
  const [shown, setShown] = useState({ index, direction: null as StepDirection | null });
  if (shown.index !== index) setShown({ index, direction: stepDirection(shown.index, index) });
  const entering = shown.direction === null ? {} : { entering: ENTERING[shown.direction] };

  return (
    <Animated.View key={index} testID={`step-transition-${index}`} {...entering} className="gap-4">
      {children}
    </Animated.View>
  );
}
