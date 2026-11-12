import { useState } from "react";

import { nextStep, previousStep } from "../model/model.form-steps";

/** Position dans un formulaire en plusieurs étapes, et actions pour s'y déplacer. */
export interface FormSteps {
  /** Étape courante, à partir de 0. */
  readonly index: number;
  readonly total: number;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly next: () => void;
  readonly back: () => void;
  /** Revient à la première étape, par exemple après une création. */
  readonly reset: () => void;
}

/**
 * Gère l'étape courante d'un formulaire découpé en plusieurs étapes.
 * @param total Nombre d'étapes, au moins deux.
 * @returns L'étape courante et les actions de navigation.
 */
export function useFormSteps(total: number): FormSteps {
  const [index, setIndex] = useState(0);

  return {
    index,
    total,
    isFirst: index === 0,
    isLast: index === total - 1,
    next: () => setIndex((current) => nextStep(current, total)),
    back: () => setIndex(previousStep),
    reset: () => setIndex(0),
  };
}
