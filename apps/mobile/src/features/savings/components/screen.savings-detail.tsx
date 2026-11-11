import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { EmptyState } from "../../../shared/components/macros/state.empty";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { SavingsDetailContent } from "./content.savings-detail";

/** Props de l'écran de détail d'une carte de pointage. */
export interface SavingsDetailScreenProps {
  /** Identifiant de la carte demandée. */
  readonly id: string;
}

/**
 * Écran de détail d'une carte de pointage, retrouvée dans le portefeuille local.
 * @param props Identifiant de la carte.
 * @returns L'écran de détail de la carte de pointage.
 */
export function SavingsDetailScreen(props: SavingsDetailScreenProps) {
  const { id } = props;
  const cards = usePortfolioStore((state) => state.cards);
  const card = cards.find((item) => item.id === id);

  return (
    <ScreenFrame>
      <DetailHeader title={card?.name ?? "Carte"} />
      {card === undefined ? (
        <EmptyState
          title="Carte introuvable"
          message="Cette carte n'existe pas ou a été supprimée."
        />
      ) : (
        <SavingsDetailContent item={card} />
      )}
    </ScreenFrame>
  );
}
