import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { useSessionStore } from "../../../shared/session/store.session";

/** Props de la feuille de déconnexion. */
export interface SignOutSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Demande confirmation avant de fermer la session et d'ouvrir la connexion.
 * Renoncer passe par la croix de la feuille : pas de bouton « Annuler ».
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille de déconnexion.
 */
export function SignOutSheet(props: SignOutSheetProps) {
  const { visible, onClose } = props;
  const signOut = useSessionStore((state) => state.signOut);

  const confirm = () => {
    onClose();
    signOut();
  };

  return (
    <BottomSheet visible={visible} title="Se déconnecter" onClose={onClose}>
      <SheetText>
        Vous devrez saisir votre numéro et votre code pour retrouver vos tontines. Votre photo reste
        disponible sur cet appareil.
      </SheetText>
      <SheetPrimaryButton
        label="Se déconnecter"
        accessibilityLabel="Confirmer la déconnexion"
        tone="danger"
        onPress={confirm}
      />
    </BottomSheet>
  );
}
