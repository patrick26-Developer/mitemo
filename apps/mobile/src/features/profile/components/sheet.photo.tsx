import { Camera, Images } from "lucide-react-native";

import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { SheetRow } from "../../../shared/components/atoms/row.sheet";
import { SheetSection } from "../../../shared/components/macros/section.sheet";
import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { PhotoSheetError } from "./error.photo-sheet";

/** Props de la feuille de choix de la photo de profil. */
export interface PhotoSheetProps {
  readonly visible: boolean;
  /** Message d'échec du dernier changement, `null` quand tout va bien. */
  readonly errorMessage?: string | null;
  readonly onClose: () => void;
  /** Ouvre la galerie de l'appareil. */
  readonly onPickFromLibrary: () => void;
  /** Ouvre l'appareil photo. */
  readonly onTakePhoto: () => void;
}

/**
 * Propose les sources de la photo de profil sans quitter l'écran.
 * @param props Visibilité, erreur éventuelle, fermeture et actions de choix.
 * @returns La feuille de la photo de profil.
 */
export function PhotoSheet(props: PhotoSheetProps) {
  const { visible, errorMessage = null, onClose, onPickFromLibrary, onTakePhoto } = props;

  return (
    <BottomSheet visible={visible} title="Photo de profil" onClose={onClose}>
      <SheetSection title="Choisir une photo">
        <SheetRow
          icon={Images}
          label="Choisir dans la galerie"
          description="Une photo carrée déjà présente sur votre téléphone"
          onPress={onPickFromLibrary}
          testID="photo-from-library"
        />
        <SheetRow
          icon={Camera}
          label="Prendre une photo"
          description="Avec l'appareil photo de votre téléphone"
          onPress={onTakePhoto}
          testID="photo-from-camera"
        />
      </SheetSection>
      {errorMessage ? <PhotoSheetError message={errorMessage} /> : null}
      <SheetText>
        La photo choisie remplace votre initiale sur votre profil et reste enregistrée sur cet
        appareil.
      </SheetText>
    </BottomSheet>
  );
}
