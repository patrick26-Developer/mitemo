import { useState } from "react";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import { canEditCardAmounts } from "../../../shared/member/model.card-edit";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { CardEditForm } from "../model/model.card-options";
import { cardEditForm, parseCardEdit } from "../model/model.card-options";
import { useSavingsActions } from "./hook.savings-actions";

/**
 * État de la feuille d'options d'une carte : la saisie de la modification,
 * son enregistrement et la suppression.
 * @param card Carte affichée.
 * @param onClose Fermeture de la feuille.
 * @returns La saisie, son verrouillage et les actions.
 */
export function useSavingsOptions(card: SavingsCard, onClose: () => void) {
  const [form, setForm] = useState<CardEditForm>(() => cardEditForm(card));
  const { run } = usePortfolioFeedback();
  const show = useToastStore((state) => state.show);
  const { discard } = useSavingsActions(card);

  const change = (patch: Partial<CardEditForm>) => setForm((current) => ({ ...current, ...patch }));
  const save = () => {
    const parsed = parseCardEdit(form);
    if (!parsed.ok) return show("error", parsed.message);
    const update = () => usePortfolioStore.getState().updateCard(card.id, parsed.value);
    if (run(update, "Carte modifiée.", false)) onClose();
  };
  const remove = () => {
    onClose();
    discard();
  };

  return { form, change, save, remove, locked: !canEditCardAmounts(card) };
}
