/** Caisse d'épargne de démonstration, affichée tant que l'API n'est pas branchée. */
export interface DemoSavings {
  readonly id: string;
  readonly title: string;
  /** Montant déjà épargné, en plus petite unité de la devise (franc CFA). */
  readonly current: bigint;
  /** Objectif d'épargne, en plus petite unité de la devise (franc CFA). */
  readonly goal: bigint;
  readonly until: string;
  readonly tint: string;
  readonly description: string;
}

/** Caisses de démonstration, communes à l'accueil, à la liste et au détail. */
export const DEMO_SAVINGS: readonly DemoSavings[] = [
  {
    id: "1",
    title: "Loyer de Janvier",
    current: 20_000n,
    goal: 30_000n,
    until: "31 Décembre 2026",
    tint: "#CFD8FF",
    description:
      "Mise de côté pour le loyer de janvier. L'échéance se règle directement depuis la caisse.",
  },
  {
    id: "2",
    title: "Assurance santé",
    current: 8_000n,
    goal: 25_000n,
    until: "15 Février 2027",
    tint: "#CDF5DD",
    description:
      "Réserve pour la prime d'assurance santé de la famille, à régler avant l'échéance.",
  },
];
