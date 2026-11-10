import { router } from "expo-router";

import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetSecondaryButton } from "../../../shared/components/atoms/button.sheet-secondary";
import { SheetText } from "../../../shared/components/atoms/text.sheet";

/** Props de la feuille de déconnexion. */
export interface SignOutSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Demande confirmation avant de fermer la session et d'ouvrir la connexion.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille de déconnexion.
 */
export function SignOutSheet(props: SignOutSheetProps) {
  const { visible, onClose } = props;

  const confirm = () => {
    onClose();
    router.replace("/(auth)/sign-in");
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
      <SheetSecondaryButton
        label="Annuler"
        accessibilityLabel="Annuler la déconnexion"
        onPress={onClose}
      />
    </BottomSheet>
  );
}
