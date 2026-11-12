import { useEffect } from "react";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { allowReminders, presentReminder } from "../api/notifier.card-reminder";
import type { CardReminder } from "../model/model.card-reminder";
import { cardTransferReminders } from "../model/model.card-reminder";
import { useCardReminderStore } from "./store.card-reminders";

/**
 * Envoie les rappels encore jamais envoyés, une fois l'autorisation obtenue.
 * Un rappel n'est retenu comme envoyé qu'une fois affiché : un échec sera
 * retenté au prochain changement du portefeuille.
 * @param reminders Rappels du moment.
 */
async function sendNewReminders(reminders: readonly CardReminder[]): Promise<void> {
  const { sentIds, markSent } = useCardReminderStore.getState();
  const fresh = reminders.filter((reminder) => !sentIds.includes(reminder.id));
  if (fresh.length === 0 || !(await allowReminders())) return;

  for (const reminder of fresh) {
    await presentReminder(reminder);
    markSent(reminder.id);
  }
}

/**
 * Surveille les cartes liées à une tontine : dès qu'une cotisation est due, une
 * notification locale demande au membre de verser depuis sa carte.
 */
export function useCardReminders(): void {
  const cards = usePortfolioStore((state) => state.cards);
  const tontines = usePortfolioStore((state) => state.tontines);

  useEffect(() => {
    sendNewReminders(cardTransferReminders(cards, tontines)).catch(() => {
      // Notification refusée par le système : rien n'est retenu, le rappel sera retenté.
    });
  }, [cards, tontines]);
}
