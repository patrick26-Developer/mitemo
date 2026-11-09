import { DetailHeader } from "../../../shared/components/detail-header";
import { EmptyState } from "../../../shared/components/empty-state";
import { ScreenFrame } from "../../../shared/components/screen-frame";
import { DEMO_SAVINGS } from "../../../shared/demo/savings";
import { SavingsDetailContent } from "./savings-detail-content";

/** Props de l'écran de détail d'une carte de pointage. */
export interface SavingsDetailScreenProps {
  /** Identifiant de la carte demandée. */
  readonly id: string;
}

/**
 * Écran de détail d'une carte de pointage, retrouvée par son identifiant.
 * @param props Identifiant de la carte.
 * @returns L'écran de détail de la carte de pointage.
 */
export function SavingsDetailScreen(props: SavingsDetailScreenProps) {
  const { id } = props;
  const savings = DEMO_SAVINGS.find((item) => item.id === id);

  return (
    <ScreenFrame>
      <DetailHeader title={savings?.title ?? "Carte"} />
      {savings ? (
        <SavingsDetailContent item={savings} />
      ) : (
        <EmptyState
          title="Carte introuvable"
          message="Cette carte n'existe pas ou a été supprimée."
        />
      )}
    </ScreenFrame>
  );
}
