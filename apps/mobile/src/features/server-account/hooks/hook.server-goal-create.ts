import { useState } from "react";
import { savingsApi } from "../../../shared/api/config.api";
import { useAsyncAction } from "../../../shared/hooks/hook.async-action";
import type { GoalFormInput } from "../model/model.goal-form";
import { goalRequest, InvalidGoalFormError } from "../model/model.goal-form";

const INITIAL_FORM: GoalFormInput = { name: "", amount: "", installments: "", startsAt: "" };
function goalFailure(error: unknown): string {
  return error instanceof InvalidGoalFormError
    ? error.message
    : "Création non confirmée. Relisez la liste avant de réessayer.";
}

/**
 * Crée l'objectif sur le serveur, sans crédit ni débit implicite.
 * @param onCreated Relit la liste après une création confirmée.
 * @returns Saisie, messages, état réseau et action de création.
 */
export function useServerGoalCreate(onCreated: () => void) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [message, setMessage] = useState("");
  const action = useAsyncAction(goalFailure);
  const update = (field: keyof GoalFormInput, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const submit = () =>
    action.run(async () => {
      await savingsApi.create(goalRequest(form));
      setForm(INITIAL_FORM);
      setMessage("Objectif créé sur le serveur. Aucun montant débité.");
      onCreated();
    });
  return { form, update, message: action.error || message, pending: action.pending, submit };
}
