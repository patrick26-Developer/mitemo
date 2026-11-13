import { router } from "expo-router";
import { useState } from "react";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { TontineSettingsForm } from "../model/model.tontine-settings-form";
import { parseTontineSettings, settingsFormOf } from "../model/model.tontine-settings-form";

/** État de la feuille de réglages d'une tontine. */
export interface TontineSettingsState {
  readonly form: TontineSettingsForm;
  readonly change: (patch: Partial<TontineSettingsForm>) => void;
  /** Valide, enregistre puis ferme la feuille ; une erreur la garde ouverte. */
  readonly save: () => void;
  /** Supprime la tontine, ferme la feuille et revient à la liste des tontines. */
  readonly remove: () => void;
}

/**
 * Saisie et enregistrement des réglages d'une tontine par son administrateur.
 * @param item Tontine réglée.
 * @param onClose Ferme la feuille après l'enregistrement.
 * @returns La saisie, son changement et l'enregistrement.
 */
export function useTontineSettings(item: Tontine, onClose: () => void): TontineSettingsState {
  const [form, setForm] = useState(() => settingsFormOf(item));
  const show = useToastStore((state) => state.show);
  const { run } = usePortfolioFeedback();
  const save = () => {
    const parsed = parseTontineSettings(form);
    if (!parsed.ok) return show("error", parsed.message);
    const store = usePortfolioStore.getState();
    if (run(() => store.updateTontineSettings(item.id, parsed.value), null)) onClose();
  };

  const remove = () => {
    onClose();
    router.back();
    run(() => usePortfolioStore.getState().deleteTontine(item.id), "Tontine supprimée.", false);
  };
  const change = (patch: Partial<TontineSettingsForm>) =>
    setForm((current) => ({ ...current, ...patch }));

  return { form, change, save, remove };
}
