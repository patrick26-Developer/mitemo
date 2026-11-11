import { useState } from "react";

import type { PhotoChangeOutcome } from "./hook.profile-photo";
import { useProfilePhoto } from "./hook.profile-photo";

/** Props de l'en-tête reliées à la photo de profil. */
interface PhotoHeaderProps {
  readonly photoUri: string | null;
  readonly photoSaving: boolean;
  readonly onChangePhoto: () => void;
}

/** Props de la feuille de choix de la photo. */
interface PhotoSheetProps {
  readonly visible: boolean;
  readonly errorMessage: string | null;
  readonly onClose: () => void;
  readonly onPickFromLibrary: () => void;
  readonly onTakePhoto: () => void;
}

/** Photo partagée et état de la feuille de choix. */
interface ProfilePhotoSheet {
  readonly headerProps: PhotoHeaderProps;
  readonly sheetProps: PhotoSheetProps;
}

/**
 * Ouvre la feuille en effaçant le message d'échec d'une tentative précédente.
 * @param clearError Effacement du message d'échec.
 * @param setVisible Mise à jour de la visibilité de la feuille.
 */
function openSheet(clearError: () => void, setVisible: (visible: boolean) => void): void {
  clearError();
  setVisible(true);
}

/**
 * Ferme la feuille en effaçant le message d'échec qu'elle affichait.
 * @param clearError Effacement du message d'échec.
 * @param setVisible Mise à jour de la visibilité de la feuille.
 */
function closeSheet(clearError: () => void, setVisible: (visible: boolean) => void): void {
  clearError();
  setVisible(false);
}

/**
 * Ferme la feuille dès que le sélecteur a rendu la main, pour ne pas faire
 * attendre la compression. Un échec d'enregistrement survient après la
 * fermeture : la feuille se rouvre alors avec son message intégré, jamais une
 * alerte. Un sélecteur qui ne s'ouvre pas laisse la feuille ouverte.
 * @param change Changement de photo à mener.
 * @param setVisible Mise à jour de la visibilité de la feuille.
 */
function choosePhoto(
  change: (onPickerClosed: () => void) => Promise<PhotoChangeOutcome>,
  setVisible: (visible: boolean) => void,
): void {
  let pickerClosed = false;
  const onPickerClosed = () => {
    pickerClosed = true;
    setVisible(false);
  };

  void change(onPickerClosed).then((outcome) => {
    if (outcome.status === "failed" && pickerClosed) setVisible(true);
  });
}

/**
 * Relie la photo partagée à l'en-tête du profil et à sa feuille de choix.
 *
 * La feuille reste montée pendant l'appel au sélecteur système : la fermer
 * avant produirait un conflit avec le `Modal` React Native, et le sélecteur ne
 * s'ouvrirait pas sur Android.
 * @returns Les props de l'en-tête et celles de la feuille.
 */
export function useProfilePhotoSheet(): ProfilePhotoSheet {
  const { photoUri, isSaving, errorMessage, clearError, pickPhoto, takePhoto } = useProfilePhoto();
  const [visible, setVisible] = useState(false);

  return {
    headerProps: {
      photoUri,
      photoSaving: isSaving,
      onChangePhoto: () => openSheet(clearError, setVisible),
    },
    sheetProps: {
      visible,
      errorMessage,
      onClose: () => closeSheet(clearError, setVisible),
      onPickFromLibrary: () => choosePhoto(pickPhoto, setVisible),
      onTakePhoto: () => choosePhoto(takePhoto, setVisible),
    },
  };
}
