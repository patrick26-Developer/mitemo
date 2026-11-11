import type { SavingsCard } from "../member/model.portfolio";

/**
 * Cartes de pointage livrées avec l'application tant que l'API n'est pas
 * branchée. La première est rattachée à une tontine, les deux autres sont
 * indépendantes.
 */
export const INITIAL_CARDS: readonly SavingsCard[] = [
  {
    id: "1",
    name: "Loyer de Janvier",
    goal: 30_000n,
    markerAmount: 5_000n,
    markersTotal: 6,
    frequency: { unit: "semaine", interval: 1 },
    startDate: "2026-11-01",
    saved: 20_000n,
    deadline: "2026-12-31",
    tint: "#CFD8FF",
    state: "ACTIVE",
    description:
      "Mise de côté pour le loyer de janvier. Chaque marqueur vaut 5 000 FCFA et l'échéance se règle depuis la carte.",
    tontineId: "1",
    fee: 3_000n,
    entries: [
      { at: "2026-11-01T08:12:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
      { at: "2026-11-04T17:45:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
      { at: "2026-11-07T09:30:00.000Z", amount: 5_000n, method: "AIRTEL_MONEY" },
      { at: "2026-11-10T18:05:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
    ],
  },
  {
    id: "2",
    name: "Assurance santé",
    goal: 25_000n,
    markerAmount: 5_000n,
    markersTotal: 5,
    frequency: { unit: "mois", interval: 1 },
    startDate: "2026-10-15",
    saved: 8_000n,
    deadline: "2027-02-15",
    tint: "#CDF5DD",
    state: "ACTIVE",
    description:
      "Réserve pour la prime d'assurance santé de la famille, à régler avant l'échéance.",
    tontineId: null,
    fee: 2_500n,
    entries: [
      { at: "2026-10-15T10:20:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
      { at: "2026-11-05T16:10:00.000Z", amount: 3_000n, method: "AIRTEL_MONEY" },
    ],
  },
  {
    id: "3",
    name: "Fonds d'urgence",
    goal: 50_000n,
    markerAmount: 10_000n,
    markersTotal: 5,
    frequency: { unit: "mois", interval: 1 },
    startDate: "2026-01-30",
    saved: 50_000n,
    deadline: "2026-06-30",
    tint: "#F5D7B0",
    state: "ARCHIVED",
    description: "Réserve de précaution entièrement constituée, puis retirée sur le solde.",
    tontineId: null,
    fee: 5_000n,
    entries: [
      { at: "2026-01-30T09:00:00.000Z", amount: 10_000n, method: "MTN_MOMO" },
      { at: "2026-02-27T09:40:00.000Z", amount: 10_000n, method: "MTN_MOMO" },
      { at: "2026-03-30T08:55:00.000Z", amount: 10_000n, method: "AIRTEL_MONEY" },
      { at: "2026-04-30T12:15:00.000Z", amount: 10_000n, method: "MTN_MOMO" },
      { at: "2026-05-29T17:30:00.000Z", amount: 10_000n, method: "MTN_MOMO" },
    ],
  },
];
