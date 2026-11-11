import type { StepForm } from "../../../shared/hooks/hook.step-form";
import { useStepForm } from "../../../shared/hooks/hook.step-form";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { TontineFormState } from "../model/model.tontine-form";
import {
  INITIAL_TONTINE_FORM,
  TONTINE_FORM_STEPS,
  parseTontineForm,
  tontineStepError,
} from "../model/model.tontine-form";

/**
 * Gère la saisie en trois étapes et la création d'une tontine.
 * @param onDone Appelé quand la feuille doit se fermer.
 * @returns La saisie, l'erreur, l'étape courante et les actions.
 */
export function useTontineCreate(onDone: () => void): StepForm<TontineFormState> {
  const createTontine = usePortfolioStore((state) => state.createTontine);

  return useStepForm({
    initial: INITIAL_TONTINE_FORM,
    total: TONTINE_FORM_STEPS.length,
    validateStep: tontineStepError,
    parse: parseTontineForm,
    onCreate: createTontine,
    onDone,
  });
}
