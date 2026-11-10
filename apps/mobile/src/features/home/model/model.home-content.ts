import { DEMO_SAVINGS } from "../../../shared/demo/demo.savings";
import { DEMO_TONTINES } from "../../../shared/demo/demo.tontines";
import type { DemoSavings } from "../../../shared/demo/demo.savings";
import type { DemoTontine } from "../../../shared/demo/demo.tontines";

/** Soldes de l'accueil, en plus petite unité de la devise (franc CFA). */
export interface HomeBalance {
  readonly available: bigint;
  readonly saved: bigint;
}

/** Tontine suivie par le membre, résumée sur une carte d'accueil. */
export type HomeTontine = DemoTontine;

/** Carte de pointage suivie sur l'accueil. */
export type HomeSavings = DemoSavings;

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

/**
 * Formate un compteur de section, au singulier ou au pluriel.
 * @param count Nombre d'éléments affichés.
 * @param singular Libellé au singulier.
 * @param plural Libellé au pluriel.
 * @returns Le libellé compté, par exemple « 2 Tontines ».
 */
export function formatCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
