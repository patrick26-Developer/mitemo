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
    markerAmount: 5_000n,
    markersTotal: 6,
    saved: 20_000n,
    deadline: "2026-12-31",
    tint: "#CFD8FF",
    state: "ACTIVE",
    description:
      "Mise de côté pour le loyer de janvier. Chaque marqueur vaut 5 000 FCFA et l'échéance se règle depuis la carte.",
    tontineId: "1",
  },
  {
    id: "2",
    name: "Assurance santé",
    markerAmount: 5_000n,
    markersTotal: 5,
    saved: 8_000n,
    deadline: "2027-02-15",
    tint: "#CDF5DD",
    state: "ACTIVE",
    description:
      "Réserve pour la prime d'assurance santé de la famille, à régler avant l'échéance.",
    tontineId: null,
  },
  {
    id: "3",
    name: "Fonds d'urgence",
    markerAmount: 10_000n,
    markersTotal: 5,
    saved: 50_000n,
    deadline: "2026-06-30",
    tint: "#F5D7B0",
    state: "COMPLETED",
    description: "Réserve de précaution entièrement constituée, clôturée à l'échéance.",
    tontineId: null,
  },
];
