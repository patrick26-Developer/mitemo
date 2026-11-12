import type { SavingsCard, Tontine } from "../../../shared/member/model.portfolio";

/** Cartes montrées par section de l'accueil : le reste se voit dans l'onglet. */
export const HOME_PREVIEW_LIMIT = 5;

/** Ce que l'accueil affiche : chaque section n'apparaît que si elle a du contenu. */
export interface HomeSections {
  /** Aperçu des tontines lancées ; leur section est masquée quand la liste est vide. */
  readonly tontines: readonly Tontine[];
  /** Nombre total de tontines lancées, aperçu compris. */
  readonly tontineCount: number;
  /** Aperçu des cartes non archivées ; leur section est masquée quand la liste est vide. */
  readonly cards: readonly SavingsCard[];
  /** Nombre total de cartes non archivées, aperçu compris. */
  readonly cardCount: number;
  /** Vrai quand rien n'est actif : l'accueil invite à créer une tontine ou une carte. */
  readonly empty: boolean;
}

/**
 * Choisit les sections de l'accueil.
 * @param tontines Tontines du membre.
 * @param cards Cartes de pointage du membre.
 * @returns L'aperçu de chaque section, son total, et l'indicateur d'accueil vide.
 */
export function homeSections(
  tontines: readonly Tontine[],
  cards: readonly SavingsCard[],
): HomeSections {
  const activeTontines = tontines.filter((item) => item.state === "ACTIVE");
  const activeCards = cards.filter((item) => item.state !== "ARCHIVED");
  return {
    tontines: activeTontines.slice(0, HOME_PREVIEW_LIMIT),
    tontineCount: activeTontines.length,
    cards: activeCards.slice(0, HOME_PREVIEW_LIMIT),
    cardCount: activeCards.length,
    empty: activeTontines.length === 0 && activeCards.length === 0,
  };
}
