import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { EmptyState } from "../../../shared/components/macros/state.empty";
import { TAB_ICONS } from "../../../shared/theme/theme.tab-icons";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { DetailFocus } from "../../../shared/model/model.detail-focus";
import { NO_FOCUS } from "../../../shared/model/model.detail-focus";
import { SavingsDetailContent } from "./content.savings-detail";
import { SavingsDetailHeader } from "./header.savings-detail";

/** Props de l'écran de détail d'une carte de pointage. */
export interface SavingsDetailScreenProps {
  /** Identifiant de la carte demandée. */
  readonly id: string;
  /** Endroit à ouvrir, demandé par une notification. */
  readonly focus?: DetailFocus;
}

/**
 * Écran de détail d'une carte de pointage, retrouvée dans le portefeuille local.
 * @param props Identifiant de la carte et endroit à ouvrir.
 * @returns L'écran de détail de la carte de pointage.
 */
export function SavingsDetailScreen(props: SavingsDetailScreenProps) {
  const { id, focus = NO_FOCUS } = props;
  const cards = usePortfolioStore((state) => state.cards);
  const card = cards.find((item) => item.id === id);

  return (
    <ScreenFrame>
      {card === undefined ? <DetailHeader title="Carte" /> : <SavingsDetailHeader item={card} />}
      {card === undefined ? (
        <EmptyState
          icon={TAB_ICONS.savings}
          title="Carte introuvable"
          message="Cette carte n'existe pas ou a été supprimée."
        />
      ) : (
        <SavingsDetailContent item={card} initialPay={focus.pay} />
      )}
    </ScreenFrame>
  );
}
