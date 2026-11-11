import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { ProfileCounts } from "../../../shared/model/model.profile-actions";

/**
 * Compte les tontines et cartes actives du portefeuille, pour les lignes
 * « Mes tontines » et « Mes cartes » du profil.
 * @returns Les nombres de tontines et de cartes actives.
 */
export function useProfileCounts(): ProfileCounts {
  const tontines = usePortfolioStore((state) => state.tontines);
  const cards = usePortfolioStore((state) => state.cards);

  return {
    tontines: tontines.filter((tontine) => tontine.state === "ACTIVE").length,
    cards: cards.filter((card) => card.state === "ACTIVE").length,
  };
}
