import { router } from "expo-router";
import { Pressable, Text } from "react-native";

import { BottomSheet } from "../../../shared/components/bottom-sheet";
import { PressableScale } from "../../../shared/components/pressable-scale";
import { SheetText } from "../../../shared/components/sheet-text";

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
      <PressableScale
        accessibilityLabel="Confirmer la déconnexion"
        onPress={confirm}
        className="rounded-[16px] bg-danger"
      >
        <Text className="py-3.5 text-center text-[15px] font-semibold text-white">
          Se déconnecter
        </Text>
      </PressableScale>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Annuler la déconnexion"
        onPress={onClose}
        className="rounded-[16px] border border-card-border py-3.5"
      >
        <Text className="text-center text-[15px] font-medium text-ink">Annuler</Text>
      </Pressable>
    </BottomSheet>
  );
}
