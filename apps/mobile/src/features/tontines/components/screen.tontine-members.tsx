import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { EmptyState } from "../../../shared/components/macros/state.empty";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { TAB_ICONS } from "../../../shared/theme/theme.tab-icons";
import { TontineMembersContent } from "./content.tontine-members";

/** Props de l'écran de la liste complète des membres. */
export interface TontineMembersScreenProps {
  /** Identifiant de la tontine demandée. */
  readonly id: string;
}

/**
 * Écran de la liste complète des membres d'une tontine, ouvert depuis
 * « Voir tous les membres » : recherche, filtres et lignes de chaque membre.
 * @param props Identifiant de la tontine.
 * @returns L'écran des membres, ou l'état vide d'une tontine introuvable.
 */
export function TontineMembersScreen(props: TontineMembersScreenProps) {
  const tontine = usePortfolioStore((state) => state.tontines.find((item) => item.id === props.id));

  return (
    <ScreenFrame>
      {tontine === undefined ? (
        <>
          <DetailHeader title="Membres" />
          <EmptyState
            icon={TAB_ICONS.tontines}
            title="Tontine introuvable"
            message="Cette tontine n'existe pas ou a été supprimée."
          />
        </>
      ) : (
        <TontineMembersContent item={tontine} />
      )}
    </ScreenFrame>
  );
}
