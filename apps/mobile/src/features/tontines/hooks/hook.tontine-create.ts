import { router } from "expo-router";

import type { StepForm } from "../../../shared/hooks/hook.step-form";
import { useStepForm } from "../../../shared/hooks/hook.step-form";
import type { CreateTontineInput } from "../../../shared/member/model.portfolio-create";
import { useCelebrationStore } from "../../../shared/feedback/store.celebration";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { TontineFormState } from "../model/model.tontine-form";
import {
  INITIAL_TONTINE_FORM,
  TONTINE_FORM_STEPS,
  parseTontineForm,
  tontineStepError,
} from "../model/model.tontine-form";

/** Règles du formulaire de création en trois étapes. */
const CREATE_RULES = {
  initial: INITIAL_TONTINE_FORM,
  total: TONTINE_FORM_STEPS.length,
  validateStep: tontineStepError,
  parse: parseTontineForm,
} as const;

/**
 * Formulaire de création d'une tontine : une fois créée, la feuille se ferme
 * et la page de la tontine s'ouvre sous les confettis ; l'administrateur y
 * invite ses membres.
 * @param onDone Fermeture de la feuille.
 * @returns L'état du formulaire en étapes.
 */
export function useTontineCreate(onDone: () => void): StepForm<TontineFormState> {
  const createTontine = usePortfolioStore((state) => state.createTontine);
  const celebrate = useCelebrationStore((state) => state.celebrate);
  const onCreate = (input: CreateTontineInput) => {
    router.push(`/tontine/${createTontine(input).id}`);
    celebrate();
  };

  return useStepForm({ ...CREATE_RULES, onCreate, onDone });
}
