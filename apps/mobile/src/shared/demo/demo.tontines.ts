/** État d'une tontine de démonstration. */
export type DemoTontineState = "ACTIVE" | "COMPLETED";

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
  /** État de la tontine, actif ou terminé. */
  readonly state: DemoTontineState;
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
    state: "ACTIVE",
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
    state: "ACTIVE",
    headerColors: ["#8B9BCE", "#C0CCF5"],
    description:
      "Tontine mensuelle entre amis. Les cotisations servent à financer un projet personnel à chaque tour.",
  },
  {
    id: "3",
    name: "Tontine du Quartier",
    members: 12,
    amount: 3_000n,
    frequency: "chaque mois",
    round: 12,
    totalRounds: 12,
    currentBeneficiary: "Mama Esther",
    state: "COMPLETED",
    headerColors: ["#F2B84B", "#F7D98A"],
    description:
      "Tontine mensuelle du quartier, clôturée après le dernier tour et le versement du pot final.",
  },
];
