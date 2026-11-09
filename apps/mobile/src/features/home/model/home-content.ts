import { DEMO_MEMBER } from "../../../shared/demo/member";
import { DEMO_SAVINGS } from "../../../shared/demo/savings";
import { DEMO_TONTINES } from "../../../shared/demo/tontines";
import type { DemoSavings } from "../../../shared/demo/savings";
import type { DemoTontine } from "../../../shared/demo/tontines";

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
export type HomeTontine = DemoTontine;

/** Carte de pointage suivie sur l'accueil. */
export type HomeSavings = DemoSavings;

/** Membre affiché tant que l'authentification n'est pas branchée. */
export const HOME_USER: HomeUser = {
  name: DEMO_MEMBER.name,
  avatarInitial: DEMO_MEMBER.avatarInitial,
};

/** Soldes affichés tant que l'API n'est pas branchée. */
export const HOME_BALANCE: HomeBalance = { available: 12_500n, saved: 2_500n };

/** Tontines en cours affichées tant que l'API n'est pas branchée. */
export const HOME_TONTINES: readonly HomeTontine[] = DEMO_TONTINES.filter(
  (item) => item.state === "ACTIVE",
);

/** Cartes de pointage en cours affichées tant que l'API n'est pas branchée. */
export const HOME_SAVINGS: readonly HomeSavings[] = DEMO_SAVINGS.filter(
  (item) => item.state === "ACTIVE",
);
