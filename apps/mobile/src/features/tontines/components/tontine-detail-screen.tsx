import { DetailHeader } from "../../../shared/components/detail-header";
import { EmptyState } from "../../../shared/components/empty-state";
import { ScreenFrame } from "../../../shared/components/screen-frame";
import { DEMO_TONTINES } from "../../../shared/demo/tontines";
import { TontineDetailContent } from "./tontine-detail-content";

/** Props de l'écran de détail d'une tontine. */
export interface TontineDetailScreenProps {
  /** Identifiant de la tontine demandée. */
  readonly id: string;
}

/**
 * Écran de détail d'une tontine, retrouvée par son identifiant.
 * @param props Identifiant de la tontine.
 * @returns L'écran de détail de la tontine.
 */
export function TontineDetailScreen(props: TontineDetailScreenProps) {
  const { id } = props;
  const tontine = DEMO_TONTINES.find((item) => item.id === id);

  return (
    <ScreenFrame>
      <DetailHeader title={tontine?.name ?? "Tontine"} />
      {tontine ? (
        <TontineDetailContent item={tontine} />
      ) : (
        <EmptyState
          title="Tontine introuvable"
          message="Cette tontine n'existe pas ou a été supprimée."
        />
      )}
    </ScreenFrame>
  );
}
