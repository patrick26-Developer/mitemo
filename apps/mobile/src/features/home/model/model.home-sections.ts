import type { SavingsCard, Tontine } from "../../../shared/member/model.portfolio";

/** Ce que l'accueil affiche : chaque section n'apparaît que si elle a du contenu. */
export interface HomeSections {
  /** Tontines lancées ; leur section est masquée quand la liste est vide. */
  readonly tontines: readonly Tontine[];
  /** Cartes de pointage non archivées ; leur section est masquée quand la liste est vide. */
  readonly cards: readonly SavingsCard[];
  /** Vrai quand rien n'est actif : l'accueil invite à créer une tontine ou une carte. */
  readonly empty: boolean;
}

/**
 * Choisit les sections de l'accueil.
 * @param tontines Tontines du membre.
 * @param cards Cartes de pointage du membre.
 * @returns Les contenus actifs et l'indicateur d'accueil vide.
 */
export function homeSections(
  tontines: readonly Tontine[],
  cards: readonly SavingsCard[],
): HomeSections {
  const activeTontines = tontines.filter((item) => item.state === "ACTIVE");
  const activeCards = cards.filter((item) => item.state !== "ARCHIVED");
  return {
    tontines: activeTontines,
    cards: activeCards,
    empty: activeTontines.length === 0 && activeCards.length === 0,
  };
}
