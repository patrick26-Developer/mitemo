import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { EmptyState } from "../../../shared/components/macros/state.empty";
import { TAB_ICONS } from "../../../shared/theme/theme.tab-icons";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import type { DetailFocus } from "../../../shared/model/model.detail-focus";
import { NO_FOCUS } from "../../../shared/model/model.detail-focus";
import { TontineDetailContent } from "./content.tontine-detail";

/** Props de l'écran de détail d'une tontine. */
export interface TontineDetailScreenProps {
  /** Identifiant de la tontine demandée. */
  readonly id: string;
  /** Endroit à ouvrir, demandé par une notification. */
  readonly focus?: DetailFocus;
}

/**
 * Écran de détail d'une tontine, retrouvée dans le portefeuille local, ouvert
 * au besoin sur le paiement ou la fiche d'un membre.
 * @param props Identifiant de la tontine et endroit à ouvrir.
 * @returns L'écran de détail de la tontine.
 */
export function TontineDetailScreen(props: TontineDetailScreenProps) {
  const { id, focus = NO_FOCUS } = props;
  const tontines = usePortfolioStore((state) => state.tontines);
  const tontine = tontines.find((item) => item.id === id);

  return (
    <ScreenFrame>
      {tontine === undefined ? (
        <>
          <DetailHeader title="Tontine" />
          <EmptyState
            icon={TAB_ICONS.tontines}
            title="Tontine introuvable"
            message="Cette tontine n'existe pas ou a été supprimée."
          />
        </>
      ) : (
        <TontineDetailContent item={tontine} focus={focus} />
      )}
    </ScreenFrame>
  );
}
