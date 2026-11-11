import { useState } from "react";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { SavingsFormState } from "../model/model.savings-form";
import { INITIAL_SAVINGS_FORM, parseSavingsForm } from "../model/model.savings-form";

/** Saisie et création d'une carte de pointage depuis une feuille. */
export interface SavingsCreateState {
  readonly form: SavingsFormState;
  readonly error: string | null;
  readonly update: (patch: Partial<SavingsFormState>) => void;
  readonly submit: () => void;
}

/**
 * Gère la saisie et la création d'une carte de pointage depuis une feuille.
 * @param onDone Appelé après la création, pour fermer la feuille.
 * @returns Les champs, l'erreur et l'action de création.
 */
export function useSavingsCreate(onDone: () => void): SavingsCreateState {
  const [form, setForm] = useState(INITIAL_SAVINGS_FORM);
  const [error, setError] = useState<string | null>(null);
  const createCard = usePortfolioStore((state) => state.createCard);

  const update = (patch: Partial<SavingsFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const submit = () => {
    const result = parseSavingsForm(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    createCard(result.value);
    onDone();
  };

  return { form, error, update, submit };
}
