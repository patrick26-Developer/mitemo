import { MemberFactList } from "../../../shared/components/macros/list.member-facts";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { ProfileLinkCard } from "./card.profile-link";

/** Props de la feuille du résumé du membre. */
export interface MemberSummarySheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  /** Mène à la page profil, où le membre peut tout modifier. */
  readonly onOpenProfile: () => void;
}

/**
 * Résume l'identité du membre en colonne, une information par ligne avec son
 * icône et un trait entre chaque ligne, puis une carte fléchée qui mène à la
 * page profil.
 * @param props Visibilité, fermeture et ouverture du profil.
 * @returns La feuille du résumé du membre.
 */
export function MemberSummarySheet(props: MemberSummarySheetProps) {
  const { visible, onClose, onOpenProfile } = props;

  return (
    <BottomSheet visible={visible} title="Mes informations" onClose={onClose}>
      <MemberFactList />
      <ProfileLinkCard onPress={onOpenProfile} />
    </BottomSheet>
  );
}
