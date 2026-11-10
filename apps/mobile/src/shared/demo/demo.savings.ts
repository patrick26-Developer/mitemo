/** État d'une carte de pointage de démonstration. */
export type DemoSavingsState = "ACTIVE" | "COMPLETED";

/** Carte de pointage de démonstration, affichée tant que l'API n'est pas branchée. */
export interface DemoSavings {
  readonly id: string;
  readonly title: string;
  /** Montant déjà épargné, en plus petite unité de la devise (franc CFA). */
  readonly current: bigint;
  /** Objectif d'épargne, en plus petite unité de la devise (franc CFA). */
  readonly goal: bigint;
  readonly until: string;
  readonly tint: string;
  /** État de la carte, active ou terminée. */
  readonly state: DemoSavingsState;
  readonly description: string;
}

/** Cartes de pointage de démonstration, communes à l'accueil, à la liste et au détail. */
export const DEMO_SAVINGS: readonly DemoSavings[] = [
  {
    id: "1",
    title: "Loyer de Janvier",
    current: 20_000n,
    goal: 30_000n,
    until: "31 Décembre 2026",
    tint: "#CFD8FF",
    state: "ACTIVE",
    description:
      "Mise de côté pour le loyer de janvier. L'échéance se règle directement depuis la carte.",
  },
  {
    id: "2",
    title: "Assurance santé",
    current: 8_000n,
    goal: 25_000n,
    until: "15 Février 2027",
    tint: "#CDF5DD",
    state: "ACTIVE",
    description:
      "Réserve pour la prime d'assurance santé de la famille, à régler avant l'échéance.",
  },
  {
    id: "3",
    title: "Fonds d'urgence",
    current: 50_000n,
    goal: 50_000n,
    until: "30 Juin 2026",
    tint: "#F5D7B0",
    state: "COMPLETED",
    description: "Réserve de précaution entièrement constituée, clôturée à l'échéance.",
  },
];
