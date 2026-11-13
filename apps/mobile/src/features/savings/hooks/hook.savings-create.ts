import { router } from "expo-router";

import { useCelebrationStore } from "../../../shared/feedback/store.celebration";
import type { StepForm } from "../../../shared/hooks/hook.step-form";
import { useStepForm } from "../../../shared/hooks/hook.step-form";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { SavingsFormState } from "../model/model.savings-form";
import {
  INITIAL_SAVINGS_FORM,
  SAVINGS_FORM_STEPS,
  parseSavingsForm,
  savingsStepError,
} from "../model/model.savings-form";

/**
 * Gère la saisie en deux étapes et la création d'une carte de pointage.
 * L'échéance est comparée à l'instant de la validation.
 * @param onDone Appelé quand la feuille doit se fermer.
 * @returns La saisie, l'erreur, l'étape courante et les actions.
 */
export function useSavingsCreate(onDone: () => void): StepForm<SavingsFormState> {
  const createCard = usePortfolioStore((state) => state.createCard);
  const celebrate = useCelebrationStore((state) => state.celebrate);

  return useStepForm({
    initial: INITIAL_SAVINGS_FORM,
    total: SAVINGS_FORM_STEPS.length,
    validateStep: (form, step) => savingsStepError(form, step, new Date()),
    parse: (form) => parseSavingsForm(form, new Date()),
    onCreate: (input) => {
      router.push(`/savings-detail/${createCard(input).id}`);
      celebrate();
    },
    onDone,
  });
}
