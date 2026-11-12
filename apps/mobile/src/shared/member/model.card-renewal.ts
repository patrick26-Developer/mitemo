import type { SavingsCard } from "./model.portfolio";
import type { CreateCardInput } from "./model.portfolio-create";
import { buildCard } from "./model.portfolio-create";

/** Millisecondes dans une journée. */
const DAY_MS = 86_400_000;

/**
 * Décale une date ISO (`AAAA-MM-JJ`) d'un nombre de jours, en UTC.
 * @param date Date de départ.
 * @param days Jours à ajouter.
 * @returns La date décalée.
 */
function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

/**
 * Plan d'une carte qui repart après avoir été versée à sa tontine : mêmes
 * réglages, à partir d'aujourd'hui et sur la même durée.
 * @param card Carte versée.
 * @param today Date du jour, en UTC (`AAAA-MM-JJ`).
 * @returns Les paramètres de la nouvelle carte.
 */
export function renewedCardInput(card: SavingsCard, today: string): CreateCardInput {
  const span = Math.round((Date.parse(card.deadline) - Date.parse(card.startDate)) / DAY_MS);

  return {
    name: card.name,
    goal: card.goal,
    markerAmount: card.markerAmount,
    markersTotal: card.markersTotal,
    frequency: card.frequency,
    startDate: today,
    deadline: addDays(today, span),
    tontineId: card.tontineId,
    description: card.description,
  };
}

/** Cartes et solde après le versement d'une carte à sa tontine. */
export interface CardTransferOutcome {
  readonly cards: readonly SavingsCard[];
  /** Solde disponible, reste de la carte compris, en FCFA entiers. */
  readonly available: bigint;
}

/** Ce que le versement d'une carte à sa tontine fait évoluer. */
export interface CardTransferInput {
  readonly cards: readonly SavingsCard[];
  readonly available: bigint;
  readonly card: SavingsCard;
  /** Cotisation réglée avec l'épargne de la carte, en FCFA entiers. */
  readonly due: bigint;
  readonly today: string;
}

/**
 * Versement d'une carte à sa tontine, comme un fork : la carte versée est
 * archivée avec son historique, ce qui dépasse la cotisation revient au
 * solde, et une copie neuve repart en tête de liste.
 * @param input Cartes, solde, carte versée, cotisation et date du jour.
 * @returns Les cartes et le solde mis à jour.
 */
export function transferAndRenew(input: CardTransferInput): CardTransferOutcome {
  const { cards, available, card, due, today } = input;
  const archived = cards.map((entry) =>
    entry.id === card.id ? { ...entry, state: "ARCHIVED" as const } : entry,
  );

  return {
    cards: [buildCard(renewedCardInput(card, today)), ...archived],
    available: available + card.saved - due,
  };
}
