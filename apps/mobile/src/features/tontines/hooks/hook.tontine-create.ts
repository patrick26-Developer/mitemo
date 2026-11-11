import { useState } from "react";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { TontineFormState } from "../model/model.tontine-form";
import { INITIAL_TONTINE_FORM, parseTontineForm } from "../model/model.tontine-form";

/** Saisie et création d'une tontine depuis une feuille. */
export interface TontineCreateState {
  readonly form: TontineFormState;
  readonly error: string | null;
  readonly update: (patch: Partial<TontineFormState>) => void;
  readonly submit: () => void;
}

/**
 * Gère la saisie et la création d'une tontine depuis une feuille.
 * @param onDone Appelé après la création, pour fermer la feuille.
 * @returns Les champs, l'erreur et l'action de création.
 */
export function useTontineCreate(onDone: () => void): TontineCreateState {
  const [form, setForm] = useState(INITIAL_TONTINE_FORM);
  const [error, setError] = useState<string | null>(null);
  const createTontine = usePortfolioStore((state) => state.createTontine);

  const update = (patch: Partial<TontineFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const submit = () => {
    const result = parseTontineForm(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    createTontine(result.value);
    onDone();
  };

  return { form, error, update, submit };
}
