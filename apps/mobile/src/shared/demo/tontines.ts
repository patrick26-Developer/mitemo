/** Tontine de démonstration, affichée tant que l'API n'est pas branchée. */
export interface DemoTontine {
  readonly id: string;
  readonly name: string;
  readonly members: number;
  /** Cotisation par tour, en plus petite unité de la devise (franc CFA). */
  readonly amount: bigint;
  readonly frequency: string;
  readonly round: number;
  readonly totalRounds: number;
  readonly currentBeneficiary: string;
  /** Couleurs du dégradé de l'en-tête de carte, du centre vers le bord. */
  readonly headerColors: readonly [string, string];
  readonly description: string;
}

/** Tontines de démonstration, communes à l'accueil, à la liste et au détail. */
export const DEMO_TONTINES: readonly DemoTontine[] = [
  {
    id: "1",
    name: "Tontine du Marché Tolal",
    members: 10,
    amount: 5_000n,
    frequency: "chaque semaine",
    round: 4,
    totalRounds: 10,
    currentBeneficiary: "Mama Nadège",
    headerColors: ["#2CCA86", "#62F79D"],
    description:
      "Tontine hebdomadaire du marché, créée par Mama Nadège. Chaque membre reçoit le pot à tour de rôle.",
  },
  {
    id: "2",
    name: "Tontine des Amis",
    members: 8,
    amount: 10_000n,
    frequency: "chaque mois",
    round: 2,
    totalRounds: 8,
    currentBeneficiary: "Papa Jean",
    headerColors: ["#8B9BCE", "#C0CCF5"],
    description:
      "Tontine mensuelle entre amis. Les cotisations servent à financer un projet personnel à chaque tour.",
  },
];
