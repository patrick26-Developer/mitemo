import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { EmptyState } from "../../../shared/components/macros/state.empty";
import { TAB_ICONS } from "../../../shared/theme/theme.tab-icons";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { TontineDetailContent } from "./content.tontine-detail";

/** Props de l'écran de détail d'une tontine. */
export interface TontineDetailScreenProps {
  /** Identifiant de la tontine demandée. */
  readonly id: string;
}

/**
 * Écran de détail d'une tontine, retrouvée dans le portefeuille local.
 * @param props Identifiant de la tontine.
 * @returns L'écran de détail de la tontine.
 */
export function TontineDetailScreen(props: TontineDetailScreenProps) {
  const { id } = props;
  const tontines = usePortfolioStore((state) => state.tontines);
  const tontine = tontines.find((item) => item.id === id);

  return (
    <ScreenFrame>
      <DetailHeader
        title={tontine?.name ?? "Tontine"}
        {...(tontine === undefined ? {} : { accent: tontine.headerColors[0] })}
      />
      {tontine === undefined ? (
        <EmptyState
          icon={TAB_ICONS.tontines}
          title="Tontine introuvable"
          message="Cette tontine n'existe pas ou a été supprimée."
        />
      ) : (
        <TontineDetailContent item={tontine} />
      )}
    </ScreenFrame>
  );
}
