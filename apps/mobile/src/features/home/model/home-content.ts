/** Membre connecté, tel qu'affiché en en-tête de l'accueil. */
export interface HomeUser {
  readonly name: string;
  readonly avatarInitial: string;
}

/** Soldes de l'accueil, en plus petite unité de la devise (franc CFA). */
export interface HomeBalance {
  readonly available: bigint;
  readonly saved: bigint;
}

/** Tontine suivie par le membre, résumée sur une carte d'accueil. */
export interface HomeTontine {
  readonly id: string;
  readonly name: string;
  readonly members: number;
  /** Cotisation par tour, en francs CFA. */
  readonly amount: bigint;
  readonly frequency: string;
  readonly round: number;
  readonly totalRounds: number;
  readonly currentBeneficiary: string;
  /** Couleurs du dégradé de l'en-tête de carte, du centre vers le bord. */
  readonly headerColors: readonly [string, string];
}

/** Caisse d'épargne suivie sur l'accueil. */
export interface HomeSavings {
  readonly id: string;
  readonly title: string;
  /** Montant déjà épargné, en francs CFA. */
  readonly current: bigint;
  /** Objectif d'épargne, en francs CFA. */
  readonly goal: bigint;
  readonly until: string;
  readonly tint: string;
}

/** Membre affiché tant que l'authentification n'est pas branchée. */
export const HOME_USER: HomeUser = { name: "Précieuse", avatarInitial: "P" };

/** Soldes affichés tant que l'API n'est pas branchée. */
export const HOME_BALANCE: HomeBalance = { available: 12_500n, saved: 2_500n };

/** Tontines affichées tant que l'API n'est pas branchée. */
export const HOME_TONTINES: readonly HomeTontine[] = [
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
  },
];

/** Caisses affichées tant que l'API n'est pas branchée. */
export const HOME_SAVINGS: readonly HomeSavings[] = [
  {
    id: "1",
    title: "Loyer de Janvier",
    current: 20_000n,
    goal: 30_000n,
    until: "31 Décembre 2026",
    tint: "#CFD8FF",
  },
  {
    id: "2",
    title: "Assurance santé",
    current: 8_000n,
    goal: 25_000n,
    until: "15 Février 2027",
    tint: "#CDF5DD",
  },
];
