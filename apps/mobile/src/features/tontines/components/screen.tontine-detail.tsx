import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { EmptyState } from "../../../shared/components/macros/state.empty";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { DEMO_TONTINES } from "../../../shared/demo/demo.tontines";
import { TontineDetailContent } from "./content.tontine-detail";

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
